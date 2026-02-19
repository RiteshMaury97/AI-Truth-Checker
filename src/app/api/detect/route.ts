
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectToDatabase } from '@/lib/mongodb';
import ffprobe from 'ffprobe-static';
import { exec } from 'child_process';
import { promisify } from 'util';
import exifParser from 'exif-parser';

const execAsync = promisify(exec);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function analyzeImage(fileUrl: string, fileBuffer: Buffer) {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    const prompt = `Perform a deep forensic analysis of the provided image. Your analysis must include:
1.  **Error Level Analysis (ELA):** Identify areas with different compression levels.
2.  **Noise Consistency Check:** Look for inconsistencies in the noise pattern.
3.  **Compression Artifacts:** Detect unusual JPEG artifacts or blocking.
4.  **Face Anomaly Detection:** If faces are present, check for unnatural features, inconsistent lighting, or strange blending.

Based on your analysis, provide a \`visualAuthenticityScore\` from 0 to 100, where 100 is completely authentic. Return a single JSON object with the score and a brief explanation.

Example:
{
  \"visualAuthenticityScore\": 15,
  \"explanation\": \"The image shows significant JPEG artifacts around the subject\\\'s head, and the noise pattern is inconsistent with the rest of the image. ELA reveals a high variance in compression levels.\"\n}`;

    const imagePart = { inlineData: { data: Buffer.from(fileBuffer).toString('base64'), mimeType: 'image/jpeg' } };
    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();
    const match = text.match(/{[\s\S]*}/);
    if (!match) throw new Error("Invalid response from AI model");
    return JSON.parse(match[0]);
}

async function analyzeVideo(fileUrl: string) {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Analyze the provided video\\\'s metadata and characteristics. Your analysis must cover:
1.  **Keyframe Analysis:** (Conceptual) Describe what you would look for in keyframes to detect manipulation.
2.  **Temporal Consistency:** Are there any jumps, glitches, or unnatural transitions?
3.  **Lip-Sync Consistency:** If a person is speaking, does the audio sync with their lip movements?

Provide a \`videoAuthenticityScore\` from 0 to 100, where 100 is completely authentic. Return a single JSON object.

Example:
{
  \"videoAuthenticityScore\": 25,
  \"explanation\": \"The video shows several temporal inconsistencies, including a noticeable jump-cut at 0:15. The speaker\\\'s lip-sync is also slightly off during the second half of the video.\"\n}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const match = text.match(/{[\s\S]*}/);
    if (!match) throw new Error("Invalid response from AI model");
    return JSON.parse(match[0]);
}

async function analyzeAudio(fileUrl: string) {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Perform a forensic analysis of this audio file. Your analysis should include:
1.  **Spectrogram Consistency:** Are there unusual patterns or artifacts in the spectrogram?
2.  **Voice Naturalness:** Does the voice sound natural? Check for robotic tones, flat intonation, or unnatural breathing.
3.  **Anti-Spoofing:** (Conceptual) Describe what anti-spoofing models would look for to detect a synthesized voice.

Provide an \`audioAuthenticityScore\` from 0 to 100. Return a single JSON object.

Example:
{
  \"audioAuthenticityScore\": 30,
  \"explanation\": \"The spectrogram shows an unnatural frequency cutoff above 15kHz, and the speaker\\\'s intonation is unusually flat throughout the recording. These are common signs of a synthesized voice.\"\n}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const match = text.match(/{[\s\S]*}/);
    if (!match) throw new Error("Invalid response from AI model");
    return JSON.parse(match[0]);
}


async function analyzeMetadata(fileUrl: string, fileBuffer: Buffer) {
    let metadataOutput = '';
    try {
        if (fileUrl.match(/\.(jpeg|jpg|tiff)$/i)) {
            const parser = exifParser.create(fileBuffer);
            const result = parser.parse();
            metadataOutput = JSON.stringify(result, null, 2);
        } else {
            const { stdout } = await execAsync(`${ffprobe.path} -v quiet -print_format json -show_format -show_streams \"${fileUrl}\"`);
            metadataOutput = stdout;
        }
    } catch (error) {
        console.error('Error extracting metadata:', error);
        metadataOutput = 'Could not extract metadata.';
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `You are a digital forensics expert. Analyze the following metadata and provide a score from 0-100 for its authenticity, where 100 is completely authentic. Look for missing fields, signs of editing software, or inconsistencies. Provide the score in a JSON object: { \"metadataAuthenticityScore\": number }. Metadata: ${metadataOutput}`;

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
        let analysisResult: any = {};
        const response = await fetch(file.url);
        const fileBuffer = await response.arrayBuffer();

        try {
            const metadata = await analyzeMetadata(file.url, Buffer.from(fileBuffer));
            analysisResult = { ...analysisResult, ...metadata };

            let authenticity = 0;

            if (file.type.startsWith('image')) {
                const imageAnalysis = await analyzeImage(file.url, Buffer.from(fileBuffer));
                analysisResult = { ...analysisResult, ...imageAnalysis };
                authenticity = (analysisResult.visualAuthenticityScore * 0.7) + (analysisResult.metadataAuthenticityScore * 0.3);
            } else if (file.type.startsWith('video')) {
                const videoAnalysis = await analyzeVideo(file.url);
                const audioAnalysis = await analyzeAudio(file.url); // Run audio analysis on video
                analysisResult = { ...analysisResult, ...videoAnalysis, ...audioAnalysis };
                authenticity = (analysisResult.videoAuthenticityScore * 0.6) + (analysisResult.audioAuthenticityScore * 0.2) + (analysisResult.metadataAuthenticityScore * 0.2);
            } else if (file.type.startsWith('audio')) {
                const audioAnalysis = await analyzeAudio(file.url);
                analysisResult = { ...analysisResult, ...audioAnalysis };
                authenticity = (analysisResult.audioAuthenticityScore * 0.8) + (analysisResult.metadataAuthenticityScore * 0.2);
            }
            
            analysisResult.authenticity = Math.max(0, Math.min(100, authenticity));

            if (analysisResult.authenticity >= 70) {
                analysisResult.authenticityStatus = 'Likely Authentic';
            } else if (analysisResult.authenticity >= 40) {
                analysisResult.authenticityStatus = 'Suspicious';
            } else {
                analysisResult.authenticityStatus = 'Likely AI Generated / Fabricated';
            }

            const reportDocument = {
                ...file,
                ...analysisResult,
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
