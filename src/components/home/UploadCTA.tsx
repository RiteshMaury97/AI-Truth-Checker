
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaUpload } from 'react-icons/fa';
import Link from 'next/link'; // Import the Link component

const UploadCTA = () => {
  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl p-12 text-center shadow-lg"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
            Start Detecting AI Fabricated Media Now
          </h2>
          <Link href="/detection"> 
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 255, 255, 0.5)' }}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-900 font-semibold rounded-full shadow-lg transform transition-transform duration-300 mx-auto"
            >
              <FaUpload />
              <span>Upload Files</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default UploadCTA;
