'use client';

import React from 'react';

const ScannerAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative w-48 h-48">
        <div className="absolute inset-0 border-4 border-indigo-500 rounded-full animate-pulse"></div>
        <div className="absolute inset-2 border-2 border-indigo-300 rounded-full"></div>
        <div className="absolute top-0 left-1/2 w-1 h-full bg-indigo-500 origin-bottom animate-spin-slow"></div>
        <div className="absolute flex items-center justify-center inset-0 text-white font-bold">
          SCANNING
        </div>
      </div>
      <p className="mt-4 text-lg text-gray-400">Analyzing file...</p>
    </div>
  );
};

export default ScannerAnimation;

// Add animation to globals.css if not present:
/*
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}
*/
