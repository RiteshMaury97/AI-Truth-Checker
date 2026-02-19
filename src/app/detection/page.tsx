
'use client';

import { useState } from 'react';
import MultiUploadBox from '@/components/MultiUploadBox';
import AnalysisReport from '@/components/AnalysisReport';

const DetectionPage = () => {
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleAnalysisComplete = (reports) => {
    setAnalysisResults(reports);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-white mb-4">Deepfake Detection</h1>
        <p className="text-xl text-gray-300">Upload your images, videos, or audio files to detect if they have been manipulated by AI.</p>
      </div>
      <MultiUploadBox onAnalysisComplete={handleAnalysisComplete} />
      {analysisResults && <AnalysisReport reports={analysisResults} />}
    </div>
  );
};

export default DetectionPage;
