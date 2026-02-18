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
  const files = data.getAll('files') as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
  }

  const analysisResults = [];

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      const imageUrl = await uploadToImageKit(buffer, file.name);

      if (!imageUrl) {
        // Skip this file and continue with the next one
        console.error(`Failed to upload ${file.name} to ImageKit.`);
        continue;
      }

      const mediaType = file.type.startsWith('image')
        ? 'image'
        : file.type.startsWith('video')
        ? 'video'
        : 'audio';

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
      analysisResults.push(analysisResult);
    } catch (error) {
      console.error(`Error processing ${file.name}:`, error);
      // Skip this file and continue with the next one
      continue;
    }
  }

  return NextResponse.json({ analysisResults });
}
