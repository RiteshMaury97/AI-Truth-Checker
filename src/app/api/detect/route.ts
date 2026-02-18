
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connectToDatabase from '@/lib/mongodb';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function analyzeWithGemini(fileUrl: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    const prompt = `Analyze this media to determine if it is a deepfake. Provide a confidence score from 0 to 100 and a brief explanation of your findings.`;

    // Fetch the image data from the URL
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    const imageBuffer = await response.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: response.headers.get('content-type') || 'image/jpeg',
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const analysisResult = result.response.text();
    
    const confidenceMatch = analysisResult.match(/Confidence Score: (\d+)/);
    const explanationMatch = analysisResult.match(/Explanation: (.*)/);

    return {
      confidence: confidenceMatch ? parseInt(confidenceMatch[1], 10) : 0,
      explanation: explanationMatch ? explanationMatch[1].trim() : 'No explanation provided.',
      isdeepfake: (confidenceMatch ? parseInt(confidenceMatch[1], 10) : 0) > 75, // Example threshold
    };
  } catch (error) {
    console.error('Error analyzing with Gemini:', error);
    throw new Error('Failed to analyze with Gemini');
  }
}

export async function POST(req: Request) {
  const { files } = await req.json();

  if (!files || !Array.isArray(files)) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  try {
    const { db } = await connectToDatabase();
    const reportsToInsert = [];

    for (const file of files) {
      const analysis = await analyzeWithGemini(file.url);

      const reportDocument = {
        ...file,
        ...analysis,
        status: 'completed',
        createdAt: new Date(),
      };
      reportsToInsert.push(reportDocument);
    }

    if (reportsToInsert.length > 0) {
      await db.collection('reports').insertMany(reportsToInsert);
    }

    return NextResponse.json({ reports: reportsToInsert }, { status: 201 });
  } catch (error) {
    console.error('Error processing analysis request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
