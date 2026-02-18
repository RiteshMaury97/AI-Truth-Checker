import React from 'react';
import FileUpload from '@/components/FileUpload';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Detect Deepfakes with AI</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Our advanced AI analyzes images and videos to identify manipulated content. <br /> Upload a file to see how it works.</p>
      </div>
      <FileUpload />
    </div>
  );
};

export default HomePage;
