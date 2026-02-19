
'use client';

import { useEffect, useState } from 'react';
import ReportCard from '@/components/ReportCard';
import { EnrichedMediaUpload } from '@/types/media';

const DetectionPage = () => {
  const [reports, setReports] = useState<EnrichedMediaUpload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/reports');
        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }
        const data = await response.json();
        setReports(data.reports);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-white mb-4">Analysis Reports</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">Here are the deepfake analysis reports for your uploaded files.</p>
        </div>

        {loading ? (
          <div className="text-center text-white">Loading reports...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map((report) => (
              <ReportCard key={report._id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetectionPage;
