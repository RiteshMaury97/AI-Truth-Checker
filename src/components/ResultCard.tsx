import React from 'react';
import { AnalysisResult, MediaType } from '../types/media';
import CircularProgress from './CircularProgress';

interface ResultCardProps {
  fileName: string;
  mediaType: MediaType;
  analysisResult: AnalysisResult;
}

const getStatusBadge = (percentage: number) => {
  if (percentage < 30) {
    return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Real</span>;
  }
  if (percentage < 70) {
    return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Suspicious</span>;
  }
  return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Highly Fabricated</span>;
};

const ResultCard: React.FC<ResultCardProps> = ({ fileName, mediaType, analysisResult }) => {
  const fabricationPercentage = analysisResult.fabricationPercentage * 100;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{mediaType}</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{fileName}</p>
        </div>
        <div className="flex items-center">
          {getStatusBadge(fabricationPercentage)}
        </div>
      </div>
      <div className="flex items-center">
        <div className="mr-4">
          <CircularProgress percentage={fabricationPercentage} />
        </div>
        <div>
          <p className="text-gray-700 dark:text-gray-200">{analysisResult.explanation}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
