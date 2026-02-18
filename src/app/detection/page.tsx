import React from 'react';
import FileUpload from '@/components/FileUpload';

const DetectionPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Deepfake Detection</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Upload your image or video file to detect if it has been manipulated by AI.</p>
      </div>
      <FileUpload />
    </div>
  );
};

export default DetectionPage;
