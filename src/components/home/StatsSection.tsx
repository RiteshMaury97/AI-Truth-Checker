
import React from 'react';
import Counter from './Counter';

const stats = [
  { label: 'Files Analyzed', value: 12345 },
  { label: 'Accuracy Rate', value: 98 },
  { label: 'Fabricated Media Detected', value: 6789 },
  { label: 'Reports Generated', value: 10234 },
];

const StatsSection = () => {
  return (
    <section className="py-24 bg-[#0B0F1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <h3 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-4">
                <Counter to={stat.value} />
                {stat.label === 'Accuracy Rate' && '%'}
              </h3>
              <p className="text-lg text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
