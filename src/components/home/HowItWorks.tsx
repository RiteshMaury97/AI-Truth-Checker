
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaCloud, FaRocket, FaChartLine } from 'react-icons/fa';

const steps = [
  { icon: FaUpload, title: 'Upload Media' },
  { icon: FaCloud, title: 'Store in ImageKit' },
  { icon: FaRocket, title: 'AI Analysis' },
  { icon: FaChartLine, title: 'View Reports Dashboard' },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white">How It Works</h2>
        </div>
        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-cyan-400 transform -translate-y-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.3 }}
                className="text-center relative bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700"
              >
                <div className="mb-6 mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                  <step.icon className="text-5xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">{step.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
