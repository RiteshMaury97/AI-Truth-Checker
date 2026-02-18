import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { AnalysisReport } from '@/types/media';

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

async function connectToDatabase(dbName: string) {
  await client.connect();
  return client.db(dbName);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');
  const mediaType = searchParams.get('mediaType');

  try {
    const db = await connectToDatabase('media_db');
    const analysisReportsCollection = db.collection<AnalysisReport>('analysisReports');

    const query: any = {};

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.analyzedDate = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    if (mediaType) {
      query.mediaType = mediaType;
    }
    
    const reports = await analysisReportsCollection.aggregate([
        { $match: query },
        { $sort: { analyzedDate: -1 } },
        {
            $lookup: {
                from: 'mediaUploads',
                localField: 'mediaUploadId',
                foreignField: '_id',
                as: 'mediaUpload'
            }
        },
        {
            $unwind: '$mediaUpload'
        },
        {
            $project: {
                _id: '$mediaUpload._id',
                fileName: '$mediaUpload.fileName',
                mediaType: '$mediaUpload.mediaType',
                imagekitUrl: '$mediaUpload.imagekitUrl',
                imagekitFileId: '$mediaUpload.imagekitFileId',
                uploadDate: '$mediaUpload.uploadDate',
                createdAt: '$mediaUpload.createdAt',
                analysisReportId: '$_id',
                analysisResult: {
                    _id: '$_id',
                    mediaUploadId: '$mediaUploadId',
                    fileName: '$fileName',
                    mediaType: '$mediaType',
                    imagekitUrl: '$imagekitUrl',
                    fabricationPercentage: '$fabricationPercentage',
                    authenticityPercentage: '$authenticityPercentage',
                    resultStatus: '$resultStatus',
                    explanation: '$explanation',
                    scores: '$scores',
                    analyzedDate: '$analyzedDate',
                    createdAt: '$createdAt',
                }
            }
        }
    ]).toArray();

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching analysis reports:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
}
