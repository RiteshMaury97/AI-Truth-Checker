
'use client';

import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Link from 'next/link';

const AnalysisReport = ({ reports }) => {
  if (!reports || reports.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-12 w-full max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-8"
    >
      <h2 className="text-3xl font-bold text-white mb-6">Analysis Results</h2>
      <div className="space-y-6">
        {reports.map((report, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gray-700 p-6 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              {report.isdeepfake ? (
                <FaTimesCircle className="text-4xl text-red-500" />
              ) : (
                <FaCheckCircle className="text-4xl text-green-500" />
              )}
              <div>
                <p className="text-xl font-semibold text-white">{report.name}</p>
                <p className={`text-lg ${report.isdeepfake ? 'text-red-400' : 'text-green-400'}`}>
                  Confidence Score: {report.confidence}%
                </p>
              </div>
            </div>
            <Link href={`/dashboard/report/${report._id}`} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
              View Full Report
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AnalysisReport;
