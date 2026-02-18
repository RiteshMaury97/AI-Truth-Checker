import React from 'react';
import AnalysisTable from '@/components/AnalysisTable';
import { EnrichedMediaUpload } from '@/types/media';

async function getAnalysisData(): Promise<EnrichedMediaUpload[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/reports`);
    const data = await res.json() as EnrichedMediaUpload[];
    return data;
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
