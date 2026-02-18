import React from 'react';
import ReportCard from '@/components/ReportCard';
import { EnrichedMediaUpload } from '@/types/media';

async function getAnalysisData(): Promise<Record<string, EnrichedMediaUpload[]>> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/reports`);
    const data = await res.json() as Record<string, EnrichedMediaUpload[]>;
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
        
        {Object.entries(analysisData).map(([date, reports]) => (
          <div key={date}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 my-8">{new Date(date).toDateString()}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {reports.map((report) => (
                <ReportCard key={report.analysisReportId} report={report} />
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default DashboardPage;
