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
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');
  const mediaType = searchParams.get('mediaType');

  try {
    const db = await connectToDatabase('media_db');
    const analysisReportsCollection = db.collection<AnalysisReport>('analysisReports');

    const query: any = {};

    if (startDateParam && endDateParam) {
      const startDate = new Date(startDateParam);
      const endDate = new Date(endDateParam);
      endDate.setDate(endDate.getDate() + 1); // To include the end date
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
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$analysisResult.analyzedDate" } },
                reports: { $push: "$$ROOT" }
            }
        },
        {
            $sort: { _id: -1 }
        }
    ]).toArray();

    const groupedByDate = reports.reduce((acc, group) => {
        acc[group._id] = group.reports;
        return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json(groupedByDate);
  } catch (error) {
    console.error('Error fetching analysis reports:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
}
