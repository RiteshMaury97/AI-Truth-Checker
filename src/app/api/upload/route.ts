import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { uploadToImageKit } from '@/services/imagekit';
import { analyzeMediaWithAI } from '@/services/aiAnalysis';
import { MediaUpload, AnalysisReport } from '@/types/media';

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

async function connectToDatabase(dbName: string) {
  await client.connect();
  return client.db(dbName);
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
      const imageKitResponse = await uploadToImageKit(buffer, file.name);

      if (!imageKitResponse || !imageKitResponse.url) {
        console.error(`Failed to upload ${file.name} to ImageKit.`);
        continue;
      }

      const { url, fileId } = imageKitResponse;

      const mediaType = file.type.startsWith('image')
        ? 'image'
        : file.type.startsWith('video')
        ? 'video'
        : 'audio';

      const db = await connectToDatabase('media_db');
      const mediaCollection = db.collection('mediaUploads');
      const analysisReportsCollection = db.collection('analysisReports');

      const mediaUpload: MediaUpload = {
        fileName: file.name,
        mediaType,
        imagekitUrl: url,
        imagekitFileId: fileId,
        uploadDate: new Date(),
        createdAt: new Date(),
      };

      const insertedMedia = await mediaCollection.insertOne(mediaUpload);

      const analysisResultFromAI = await analyzeMediaWithAI(url, mediaType);

      const analysisReport: AnalysisReport = {
        mediaUploadId: insertedMedia.insertedId,
        fileName: file.name,
        mediaType,
        imagekitUrl: url,
        fabricationPercentage: analysisResultFromAI.fabricationPercentage,
        authenticityPercentage: 1 - analysisResultFromAI.fabricationPercentage,
        resultStatus: analysisResultFromAI.result,
        explanation: analysisResultFromAI.explanation,
        scores: analysisResultFromAI.scores,
        analyzedDate: new Date(),
        createdAt: new Date(),
      };

      const insertedAnalysisReport = await analysisReportsCollection.insertOne(analysisReport);

      await mediaCollection.updateOne(
        { _id: insertedMedia.insertedId },
        { $set: { analysisReportId: insertedAnalysisReport.insertedId } }
      );

      analysisResults.push(analysisReport);
    } catch (error) {
      console.error(`Error processing ${file.name}:`, error);
      continue;
    }
  }

  return NextResponse.json({ analysisResults });
}
