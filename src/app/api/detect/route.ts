import { NextResponse } from 'next/server';
import { analyzeVideo } from '../../../services/detectionService';

export async function POST(request: Request) {
  console.log('Received request to /api/detect');
  try {
    const formData = await request.formData();
    const files = formData.getAll('file');

    if (!files || files.length === 0) {
      console.error('No files found in request');
      return NextResponse.json({ error: 'No files found' }, { status: 400 });
    }

    const results = [];
    for (const file of files) {
        if (file instanceof File) {
            console.log(`File received: ${file.name}, size: ${file.size}`);
            const result = await analyzeVideo(file);
            results.push(result);
            console.log('Analysis successful for file:', file.name, result);
        }
    }

    return NextResponse.json(results);
  } catch (error) {
    if (error instanceof Error) {
        console.error('Error in /api/detect:', error.message);
        console.error(error.stack);
    } else {
        console.error('An unknown error occurred in /api/detect:', error);
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
