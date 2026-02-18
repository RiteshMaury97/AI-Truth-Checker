
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaArrowRight, FaBrain } from 'react-icons/fa';

const HeroSection = () => {
  return (
    <section className="relative bg-gray-900 text-white min-h-screen flex items-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-6 leading-tight">
              AI Deepfake Detector
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Instantly analyze images, videos, and audio files to detect sophisticated AI-generated fabrications with cutting-edge accuracy.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(72, 187, 255, 0.5)' }}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-full shadow-lg transform transition-transform duration-300"
              >
                <span>Get Started</span>
                <FaArrowRight />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 px-8 py-4 text-gray-300 font-semibold"
              >
                <FaPlay />
                <span>Watch Demo</span>
              </motion.button>
            </div>
          </motion.div>
          <div className="relative hidden lg:flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="relative"
            >
              <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-cyan-500 to-purple-600 opacity-30"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-96 h-96 border-4 border-dashed border-gray-600 rounded-full flex items-center justify-center p-4">
                  <div className="w-80 h-80 border-4 border-dashed border-gray-700 rounded-full flex items-center justify-center p-4">
                    <div className="w-64 h-64 bg-gray-800 rounded-full flex items-center justify-center shadow-2xl">
                      <FaBrain className="text-9xl text-cyan-400" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
