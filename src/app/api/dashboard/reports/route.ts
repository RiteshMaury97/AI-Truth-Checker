import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { AnalysisReport } from '@/types/media';

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

async function connectToDatabase(dbName: string) {
  await client.connect();
  const db = client.db(dbName);
  await db.collection('analysisReports').createIndex({ analyzedDate: -1 });
  return db;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');
  const mediaType = searchParams.get('mediaType');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;

  try {
    const db = await connectToDatabase('media_db');
    const analysisReportsCollection = db.collection<AnalysisReport>('analysisReports');

    const query: any = {};

    if (startDateParam && endDateParam) {
      const startDate = new Date(startDateParam);
      const endDate = new Date(endDateParam);
      endDate.setDate(endDate.getDate() + 1);
      query.analyzedDate = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    if (mediaType) {
      query.mediaType = mediaType;
    }

    const reportsPromise = analysisReportsCollection.aggregate([
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
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ]).toArray();

    const totalReportsPromise = analysisReportsCollection.countDocuments(query);

    const [reports, totalReports] = await Promise.all([reportsPromise, totalReportsPromise]);

    const totalPages = Math.ceil(totalReports / limit);

    const groupedByDate = reports.reduce((acc, group) => {
        acc[group._id] = group.reports;
        return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json({
      data: groupedByDate,
      pagination: {
        currentPage: page,
        totalPages,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching analysis reports:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
}
