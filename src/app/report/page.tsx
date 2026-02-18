import React from 'react';
import InfoCard from '@/components/InfoCard';

const ReportPage = () => {
  const fileDetails = [
    { label: 'File Name', value: 'video.mp4' },
    { label: 'File Type', value: 'video/mp4' },
    { label: 'File Size', value: '10.5 MB' },
  ];

  const analysisDetails = [
    { label: 'AI Model', value: 'Deepfake-Detector-v3' },
    { label: 'Confidence Score', value: '95.8%' },
    { label: 'Detection Result', value: 'Deepfake Detected' },
  ];

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Analysis Report</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">This report provides a detailed overview of the deepfake analysis performed on your uploaded file.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <InfoCard title="File Information" details={fileDetails} />
          <InfoCard title="Analysis Details" details={analysisDetails} />
        </div>

        <div className="text-center">
          <button className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300">Download Report (PDF)</button>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
