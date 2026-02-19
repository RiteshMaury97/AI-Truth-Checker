
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import connectToDatabase from '@/lib/mongodb';
import imageKit from '@/lib/imagekit'; // Import the ImageKit SDK instance

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

<<<<<<< HEAD
// This function remains largely the same, but it no longer needs complex retry logic.
=======
>>>>>>> 1d1aefd (night work)
async function analyzeMedia(fileUrl: string, prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro-vision',
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ]
    });

<<<<<<< HEAD
    const fetchResponse = await fetch(fileUrl);
    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch media file at ${fileUrl}. Status: ${fetchResponse.status}`);
=======
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch media file: ${response.status} ${response.statusText}`);
>>>>>>> 1d1aefd (night work)
    }

    const imageBuffer = await fetchResponse.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: fetchResponse.headers.get('content-type') || 'image/jpeg',
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const apiResponse = result.response;

    if (apiResponse.promptFeedback && apiResponse.promptFeedback.blockReason) {
<<<<<<< HEAD
=======
      console.error('Gemini request was blocked', { feedback: apiResponse.promptFeedback });
>>>>>>> 1d1aefd (night work)
      throw new Error(`Analysis blocked by API due to ${apiResponse.promptFeedback.blockReason}`);
    }

    if (!apiResponse.candidates || apiResponse.candidates.length === 0) {
<<<<<<< HEAD
=======
        console.error('Gemini analysis returned no content.', { response: apiResponse });
>>>>>>> 1d1aefd (night work)
        throw new Error('Analysis from Gemini was empty or incomplete.');
    }

    const analysisResult = apiResponse.text();
    
    let confidence = 0;
    let explanation = 'Analysis could not be completed or the format was unexpected.';

    const confidenceMatch = analysisResult.match(/Confidence Score: (\d+)/);
    if (confidenceMatch && confidenceMatch[1]) {
        confidence = parseInt(confidenceMatch[1], 10);
    }

    const explanationMatch = analysisResult.match(/Explanation: (.*)/s);
    if (explanationMatch && explanationMatch[1]) {
        explanation = explanationMatch[1].trim();
    }

    return {
      confidence,
      explanation,
      isdeepfake: confidence > 75,
    };
  } catch (error) {
    console.error('Error during Gemini analysis execution:', error);
<<<<<<< HEAD
    throw new Error('Failed to analyze with Gemini.');
=======
    throw new Error('Failed to analyze with Gemini');
>>>>>>> 1d1aefd (night work)
  }
}

export async function POST(req: Request) {
  // The request body now contains the full file object, including filePath
  const { files } = await req.json();

  if (!files || !Array.isArray(files)) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  try {
    const { db } = await connectToDatabase();
    const reportsToInsert = [];

    for (const file of files) {
      let analysisUrl = file.url;
      let prompt = `Analyze this image to determine if it is a deepfake. Provide a confidence score from 0 to 100 and a brief explanation of your findings. Your response must be in the format: "Confidence Score: [score] Explanation: [text]".`;

<<<<<<< HEAD
      // THE ROBUST FIX: Use filePath and the ImageKit SDK for videos
      if (file.type.startsWith('video/') && file.filePath) {
        analysisUrl = imageKit.url({
            path: file.filePath,
            transformation: [{ "f": "jpg", "so": 1 }] // f-jpg for format, so-1 for 1st second
        });
        prompt = `Analyze this thumbnail image from a video to determine if it is a deepfake. Provide a confidence score from 0 to 100 and a brief explanation of your findings. Your response must be in the format: "Confidence Score: [score] Explanation: [text]".`;
      } else if (file.type.startsWith('video/') && !file.filePath) {
          console.error(`Cannot generate thumbnail for video without a filePath. File: ${file.name}`);
          // Skip this file as we cannot process it correctly
          continue;
=======
      if (file.type.startsWith('video/')) {
        try {
            const url = new URL(file.url);
            const pathParts = url.pathname.split('/');
            if (pathParts.length > 2) {
                pathParts.splice(2, 0, 'tr:f-jpg,so-1');
                analysisUrl = `${url.origin}${pathParts.join('/')}`;
                prompt = `Analyze this thumbnail image from a video to determine if it is a deepfake. Provide a confidence score from 0 to 100 and a brief explanation of your findings. Your response must be in the format: "Confidence Score: [score] Explanation: [text]".`;
            }
        } catch (e) {
            console.error("Failed to transform video URL for thumbnail generation:", file.url, e);
        }
>>>>>>> 1d1aefd (night work)
      }

      const analysis = await analyzeMedia(analysisUrl, prompt);
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
    console.error('Error processing analysis request in POST handler:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

