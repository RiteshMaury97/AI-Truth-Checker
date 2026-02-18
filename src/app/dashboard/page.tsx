'use client';

import React from 'react';
import AnalysisTable from '@/components/AnalysisTable';

const DashboardPage = () => {
  // In a real application, you would fetch this data from an API.
  const analysisData = [
    {
      id: '1',
      fileName: 'video1.mp4',
      mediaType: 'video',
      analysisResult: {
        fabricationPercentage: 0.85,
        result: 'fake',
        explanation: 'This is a placeholder explanation.',
      },
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      fileName: 'image1.jpg',
      mediaType: 'image',
      analysisResult: {
        fabricationPercentage: 0.25,
        result: 'real',
        explanation: 'This is a placeholder explanation.',
      },
      timestamp: new Date().toISOString(),
    },
    {
        id: '3',
        fileName: 'video2.mp4',
        mediaType: 'video',
        analysisResult: {
          fabricationPercentage: 0.65,
          result: 'fake',
          explanation: 'This is a placeholder explanation.',
        },
        timestamp: new Date().toISOString(),
      },
  ];

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
