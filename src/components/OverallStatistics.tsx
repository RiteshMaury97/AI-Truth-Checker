'use client';

import React from 'react';
import { AnalysisResult, MediaType } from '@/types/media';

interface AnalysisData {
  id: string;
  fileName: string;
  mediaType: MediaType;
  analysisResult: AnalysisResult;
  timestamp: string;
}

const OverallStatistics = ({ data }: { data: AnalysisData[] }) => {
  const totalFiles = data.length;
  const averageFabrication = totalFiles > 0 ? (data.reduce((acc, item) => acc + item.analysisResult.fabricationPercentage, 0) / totalFiles) * 100 : 0;
  const fakeCount = data.filter(item => item.analysisResult.result === 'fake').length;
  const realCount = totalFiles - fakeCount;
  const fakePercentage = totalFiles > 0 ? (fakeCount / totalFiles) * 100 : 0;
  const realPercentage = totalFiles > 0 ? (realCount / totalFiles) * 100 : 0;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Overall Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Files Analyzed</h3>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">{totalFiles}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Average Fabrication %</h3>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">{averageFabrication.toFixed(2)}%</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Fake vs. Real Ratio</h3>
            <div className="relative pt-1 mt-2">
                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-green-200">
                    <div style={{ width: `${fakePercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>{fakeCount} Fake ({fakePercentage.toFixed(1)}%)</span>
                    <span>{realCount} Real ({realPercentage.toFixed(1)}%)</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OverallStatistics;
