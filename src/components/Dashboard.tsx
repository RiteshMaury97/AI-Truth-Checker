
'use client';

import React, { useState, useEffect } from 'react';
import { AnalysisResult } from '@/types/media';

const Dashboard: React.FC = () => {
  const [reports, setReports] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/reports');
        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }
        const data = await response.json();
        setReports(data);
      } catch (error) {
        setError('An error occurred while fetching reports.');
        console.error(error);
      }
      setLoading(false);
    };

    fetchReports();
  }, []);

  if (loading) {
    return <div>Loading reports...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reports.map((report, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{report.fileName}</h3>
            <p className="text-gray-700 dark:text-gray-300">Fabrication: {report.fabricationPercentage}%</p>
            <p className="text-gray-700 dark:text-gray-300">Result: {report.result}</p>
            <p className="text-gray-700 dark:text-gray-300">Explanation: {report.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
