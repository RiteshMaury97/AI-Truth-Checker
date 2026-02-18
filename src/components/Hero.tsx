
import React from 'react';
import Link from 'next/link';

const Hero = () => {
  return (
    <div className="bg-gray-900 text-white w-full h-screen flex flex-col justify-center items-center">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 px-4">
          AI Deepfake Detector
        </h1>
        <p className="mt-4 text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto px-4">
          Uncover the truth in media. Our advanced AI analyzes videos and images to detect sophisticated deepfakes, helping you combat misinformation.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/detection" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
            Upload Media
          </Link>
          <Link href="/dashboard" className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
