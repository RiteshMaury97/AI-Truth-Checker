
import React from 'react';
import Image from 'next/image';
import { EnrichedMediaUpload } from '@/types/media';

const ReportCard = ({ report }: { report: EnrichedMediaUpload }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${report.analysisResult.resultStatus === 'REAL' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{report.analysisResult.resultStatus}</p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(report.analysisResult.analyzedDate).toLocaleDateString()}</p>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">{report.fileName}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{report.mediaType}</p>
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-md mb-4 overflow-hidden">
          <Image src={report.imagekitUrl} alt={report.fileName} width={500} height={300} className="w-full h-full object-cover" />
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <p className="text-gray-600 dark:text-gray-400">Authenticity</p>
            <p className="font-semibold text-lg text-green-500">{report.analysisResult.authenticityPercentage.toFixed(2)}%</p>
          </div>
          <div className="text-sm text-right">
            <p className="text-gray-600 dark:text-gray-400">Fabrication</p>
            <p className="font-semibold text-lg text-red-500">{report.analysisResult.fabricationPercentage.toFixed(2)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
