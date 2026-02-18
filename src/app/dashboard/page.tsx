import React from 'react';
import AnalysisTable from '@/components/AnalysisTable';
import OverallStatistics from '@/components/OverallStatistics';
import { MediaUpload } from '@/types/media';
import { MongoClient } from 'mongodb';

async function getAnalysisData(): Promise<MediaUpload[]> {
    const uri = process.env.MONGODB_URI as string;
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('media_db');
    const mediaCollection = db.collection<MediaUpload>('mediaUploads');
    const data = await mediaCollection.find({}).sort({ uploadDate: -1 }).toArray();
    await client.close();
    return data;
}

const groupDataByDate = (data: MediaUpload[]) => {
  const groupedData: { [key: string]: MediaUpload[] } = {};

  data.forEach((item) => {
    const date = new Date(item.uploadDate).toLocaleDateString();
    if (!groupedData[date]) {
      groupedData[date] = [];
    }
    groupedData[date].push(item);
  });

  return groupedData;
};

const DashboardPage = async () => {
  const analysisData = await getAnalysisData();
  const groupedData = groupDataByDate(analysisData);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Analysis Dashboard</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Browse, search, and filter all your analysis records.</p>
        </div>
        <OverallStatistics data={analysisData} />
        {
          Object.entries(groupedData).map(([date, data]) => (
            <div key={date} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">{date}</h2>
              <AnalysisTable data={data} />
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default DashboardPage;
