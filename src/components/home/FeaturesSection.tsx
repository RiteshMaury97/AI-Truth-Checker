
'use client';

import React from 'react';
import { FaCloudUploadAlt, FaCogs, FaDatabase, FaChartBar } from 'react-icons/fa';
import FeatureCard from './FeatureCard';

const features = [
  {
    icon: FaCloudUploadAlt,
    title: 'Multi Media Upload',
    description: 'Upload image, video, and audio files for analysis.',
  },
  {
    icon: FaCogs,
    title: 'AI Fabrication Analysis',
    description: 'Get a fabrication percentage and detailed report.',
  },
  {
    icon: FaDatabase,
    title: 'Cloud Storage',
    description: 'Media is stored securely on ImageKit for easy access.',
  },
  {
    icon: FaChartBar,
    title: 'Smart Dashboard',
    description: 'View date-wise reports from MongoDB.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-[#0B0F1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white">Powerful AI Features</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} delay={index * 0.2} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
