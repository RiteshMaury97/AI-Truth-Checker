
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectToDatabase } from '@/lib/mongodb';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function analyzeWithGemini(fileUrl: string) {
  console.log('Attempting to analyze with Gemini for URL:', fileUrl);
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    const prompt = `Analyze this media to determine if it is a deepfake. Provide a confidence score from 0 to 100 and a brief explanation of your findings.`;

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
    const analysisResult = result.response.text();
    console.log('Gemini analysis raw result:', analysisResult);
    
    const confidenceMatch = analysisResult.match(/Confidence Score: (\d+)/);
    const explanationMatch = analysisResult.match(/Explanation: (.*)/);

    const confidence = confidenceMatch ? parseInt(confidenceMatch[1], 10) : 0;
    const explanation = explanationMatch ? explanationMatch[1].trim() : 'No explanation provided.';
    const isDeepfake = confidence > 75;

    console.log(`Analysis complete: Confidence=${confidence}, IsDeepfake=${isDeepfake}`);
    
    return {
      confidence,
      explanation,
      isdeepfake: isDeepfake,
    };
  } catch (error) {
    console.error('Error in analyzeWithGemini:', error);
    throw new Error('Failed to analyze with Gemini');
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
        // Optionally, you could save a failed report status
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
    // Return the actual error message for easier debugging
    return NextResponse.json({ message: error.message, stack: error.stack }, { status: 500 });
  }
}
