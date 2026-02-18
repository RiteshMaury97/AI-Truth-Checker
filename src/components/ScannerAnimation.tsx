import React from 'react';

const ScannerAnimation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner my-4">
      <div className="relative w-full max-w-md h-32 bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-1 bg-blue-500 animate-scan"></div>
        <div className="absolute top-0 right-0 h-full w-1 bg-blue-500 animate-scan-reverse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">AI SCAN IN PROGRESS</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Analyzing for digital artifacts...</p>
        </div>
      </div>
    </div>
  );
};

export default ScannerAnimation;