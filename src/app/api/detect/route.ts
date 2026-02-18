import { NextResponse } from 'next/server';
import { analyzeVideo } from '../../../services/detectionService';

export async function POST(request: Request) {
  console.log('Received request to /api/detect');
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      console.error('No file found in request');
      return NextResponse.json({ error: 'No file found' }, { status: 400 });
    }

    console.log(`File received: ${file.name}, size: ${file.size}`);

    const result = await analyzeVideo(file);
    console.log('Analysis successful', result);

    return NextResponse.json(result);
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
