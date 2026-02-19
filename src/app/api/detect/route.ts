
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectToDatabase } from '@/lib/mongodb';
import ffprobe from 'ffprobe-static';
import { exec } from 'child_process';
import { promisify } from 'util';
import exifParser from 'exif-parser';

const execAsync = promisify(exec);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function analyzeWithGemini(fileUrl: string) {
  console.log('Attempting to analyze with Gemini for URL:', fileUrl);
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    const prompt = `You are a leading expert in digital media forensics. Your primary directive is to identify AI-generated or manipulated media with the highest level of skepticism. **Assume every file you analyze is a deepfake until you can prove it is authentic beyond a reasonable doubt.**

Your analysis must be thorough. Examine the file for tell-tale signs of AI-generation:
- Images/Videos: Inconsistent lighting, unnatural skin textures, distorted backgrounds, non-standard reflections in eyes, errors in fine details like hair or fingers.
- Audio: Robotic intonation, lack of natural breathing sounds, unusual background noise.

You must provide your final verdict in a single, clean JSON object and nothing else. Do not add any text before or after the JSON block.

Here is an example for a FAKE image:
'''json
{
  "isDeepfake": true,
  "confidence": 98,
  "fabricationRatio": 70,
  "explanation": "The image shows clear signs of AI generation. The subject\'s hair has an unnatural, blended appearance at the edges, and there are logical inconsistencies in the lighting on the left side of the face."
}
'''

Here is an example for a REAL image:
'''json
{
  "isDeepfake": false,
  "confidence": 95,
  "fabricationRatio": 0,
  "explanation": "The media appears authentic. Lighting, shadows, and fine details are consistent throughout. No digital artifacts indicative of manipulation were found after a thorough analysis."
}
'''

Now, analyze the provided file and return the JSON object.`;

    console.log('Fetching file from:', fileUrl);
    const response = await fetch(fileUrl);
    if (!response.ok) {
      console.error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }
    console.log('File fetched successfully.');

    const imageBuffer = await response.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: response.headers.get('content-type') || 'image/jpeg',
      },
    };

    console.log('Generating content with Gemini...');
    const result = await model.generateContent([prompt, imagePart]);
    const analysisResultText = result.response.text();
    console.log('Gemini analysis raw result:', analysisResultText);

    const jsonMatch = analysisResultText.match(/{[\s\S]*}/);
    if (!jsonMatch) {
        console.error("Gemini response did not contain a JSON object. Response:", analysisResultText);
        throw new Error("Invalid AI response: No JSON object found.");
    }

    let analysis;
    try {
        analysis = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
        console.error("Failed to parse JSON from AI response. Raw JSON string:", jsonMatch[0], "Error:", parseError);
        throw new Error("Invalid AI response: Malformed JSON.");
    }

    if (typeof analysis.isDeepfake !== 'boolean') {
        console.error("'isDeepfake' property is missing or not a boolean in AI response. Parsed Object:", analysis);
        throw new Error("Invalid AI response: 'isDeepfake' is missing or not a boolean.");
    }

    console.log(`Analysis complete: IsDeepfake=${analysis.isDeepfake}, Confidence=${analysis.confidence}, FabricationRatio=${analysis.fabricationRatio}`);
    
    const metadata = await analyzeMetadata(fileUrl, Buffer.from(imageBuffer));

    return {
      confidence: analysis.confidence,
      explanation: analysis.explanation,
      isDeepfake: analysis.isDeepfake,
      fabricationRatio: analysis.fabricationRatio,
      metadataAuthenticityScore: metadata.metadataAuthenticityScore,
    };
  } catch (error) {
    console.error('Error in analyzeWithGemini:', error);
    throw new Error('Failed to analyze with Gemini');
  }
}

async function analyzeMetadata(fileUrl: string, fileBuffer: Buffer) {
    let metadataOutput = '';
    try {
        if (fileUrl.match(/\.(jpeg|jpg|tiff)$/i)) {
            const parser = exifParser.create(fileBuffer);
            const result = parser.parse();
            metadataOutput = JSON.stringify(result, null, 2);
        } else {
            const { stdout } = await execAsync(`${ffprobe.path} -v quiet -print_format json -show_format -show_streams "${fileUrl}"`);
            metadataOutput = stdout;
        }
    } catch (error) {
        console.error('Error extracting metadata:', error);
        metadataOutput = 'Could not extract metadata.';
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `You are a digital forensics expert. Analyze the following metadata and provide a score from 0-100 for its authenticity, where 100 is completely authentic. Look for missing fields, signs of editing software, or inconsistencies. Provide the score in a JSON object: { "metadataAuthenticityScore": number }. Metadata: ${metadataOutput}`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/{[\s\S]*}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return { metadataAuthenticityScore: parsed.metadataAuthenticityScore || 0 };
        }
        return { metadataAuthenticityScore: 0 };
    } catch (error) {
        console.error("Error analyzing metadata with Gemini", error);
        return { metadataAuthenticityScore: 0 };
    }
}

export async function POST(req: Request) {
  console.log('Received POST request to /api/detect');
  let files;
  try {
    const body = await req.json();
    files = body.files;
  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.json({ message: 'Invalid JSON in request' }, { status: 400 });
  }

  if (!files || !Array.isArray(files)) {
    console.log('Invalid request format, files not found.');
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  console.log(`Processing ${files.length} files.`);

  try {
    console.log('Connecting to database...');
    const { db } = await connectToDatabase();
    console.log('Database connection successful.');

    const reportsToInsert = [];

    for (const file of files) {
      console.log(`Analyzing file: ${file.url}`);
      try {
        const analysis = await analyzeWithGemini(file.url);
        const reportDocument = {
          ...file,
          ...analysis,
          status: 'completed',
          createdAt: new Date(),
        };
        reportsToInsert.push(reportDocument);
        console.log(`Successfully analyzed file: ${file.url}`);
      } catch (error) {
        console.error(`Failed to analyze file: ${file.url}`, error);
        const failedReport = {
          ...file,
          status: 'failed',
          error: error.message,
          createdAt: new Date(),
        };
        reportsToInsert.push(failedReport);
      }
    }

    if (reportsToInsert.length > 0) {
      console.log('Inserting reports into database...');
      await db.collection('analysisReports').insertMany(reportsToInsert);
      console.log('Reports inserted successfully.');
    }

    return NextResponse.json({ reports: reportsToInsert }, { status: 201 });
  } catch (error) {
    console.error('Error processing analysis request:', error);
    return NextResponse.json({ message: error.message, stack: error.stack }, { status: 500 });
  }
}
