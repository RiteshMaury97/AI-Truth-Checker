
'use client';

import { useState, useEffect } from 'react';
import AnalysisReport from '@/components/AnalysisReport';
import Upload from '@/components/Upload';

const DashboardPage = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchReports() {
    const res = await fetch('/api/reports');
    const data = await res.json();
    setReports(data);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUploadComplete = () => {
    fetchReports(); // Re-fetch reports after upload
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-cyan-400">Forensic Analysis Dashboard</h1>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        <Upload onUploadComplete={handleUploadComplete} />
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Analysis Reports</h2>
          <div className="space-y-4">
            {reports.map((report) => (
              <AnalysisReport key={report._id} report={report} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
