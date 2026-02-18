import React from 'react';
import AnalysisTable from '@/components/AnalysisTable';
import { MediaUpload, AnalysisReport, EnrichedMediaUpload } from '@/types/media';
import { MongoClient, ObjectId } from 'mongodb';

async function getAnalysisData(): Promise<EnrichedMediaUpload[]> {
    const uri = process.env.MONGODB_URI as string;
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('media_db');
    const mediaCollection = db.collection<MediaUpload>('mediaUploads');
    const analysisReportsCollection = db.collection<AnalysisReport>('analysisReports');

    const mediaUploads = await mediaCollection.find({}).sort({ uploadDate: -1 }).toArray();
    const analysisReports = await analysisReportsCollection.find({}).toArray();

    const enrichedMediaUploads = mediaUploads.map(mediaUpload => {
        const analysisReport = analysisReports.find(report => report.mediaUploadId.equals(mediaUpload._id as ObjectId));
        return {
            ...mediaUpload,
            analysisResult: analysisReport as AnalysisReport,
        };
    });

    await client.close();
    return enrichedMediaUploads;
}

const DashboardPage = async () => {
  const analysisData = await getAnalysisData();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Analysis Dashboard</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Browse, search, and filter all your analysis records.</p>
        </div>
        <AnalysisTable data={analysisData} />
      </div>
    </div>
  );
};

export default DashboardPage;
