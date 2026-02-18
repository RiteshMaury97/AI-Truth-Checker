import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { uploadToImageKit } from '@/services/imagekit';
import { analyzeMedia } from '@/services/mediaAnalysis';
import { AnalysisData } from '@/types/media';

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

async function connectToDatabase(dbName: string, collectionName: string) {
  await client.connect();
  return client.db(dbName).collection(collectionName);
}

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file = data.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const imageUrl = await uploadToImageKit(buffer, file.name);

    if (!imageUrl) {
      return NextResponse.json({ error: 'Failed to upload to ImageKit' }, { status: 500 });
    }

    const mediaType = file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'audio';

    const analysisResult = await analyzeMedia(imageUrl, mediaType);

    const mediaCollection = await connectToDatabase('media_links', 'links');

    const analysisData: AnalysisData = {
      id: new Date().toISOString(),
      fileName: file.name,
      mediaType,
      analysisResult,
      timestamp: new Date().toISOString(),
      url: imageUrl,
    };

    await mediaCollection.insertOne(analysisData);

    return NextResponse.json(analysisData);
  } catch (error) {
    console.error('Error uploading to ImageKit:', error);
    return NextResponse.json({ error: 'Error uploading to ImageKit' }, { status: 500 });
  }
}
