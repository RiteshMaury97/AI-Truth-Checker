import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';
import { analyzeMedia } from '@/services/mediaAnalysis';
import { MediaFile, AnalysisData } from '@/types/media';

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

async function connectToDatabase() {
  await client.connect();
  return client.db('test').collection<AnalysisData>('media');
}

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file = data.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });
  const filePath = path.join(uploadsDir, file.name);
  await fs.writeFile(filePath, buffer);

  const mediaType = file.type.startsWith('image') ? 'image' : file.type.startsWith('video') ? 'video' : 'audio';

  const analysisResult = await analyzeMedia(filePath, mediaType);

  const mediaCollection = await connectToDatabase();

  const analysisData: AnalysisData = {
    id: new Date().toISOString(),
    fileName: file.name,
    mediaType,
    analysisResult,
    timestamp: new Date().toISOString(),
  };

  await mediaCollection.insertOne(analysisData);

  return NextResponse.json(analysisData);
}
