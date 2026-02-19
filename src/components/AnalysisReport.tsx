
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaFilePdf, FaFileVideo, FaFileAudio, FaFileImage, FaChevronDown, FaChevronUp, FaFileAlt } from 'react-icons/fa';

const AnalysisReport = ({ report }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getFileIcon = (type) => {
    if (type.startsWith('image')) return <FaFileImage className="text-cyan-400" />;
    if (type.startsWith('video')) return <FaFileVideo className="text-cyan-400" />;
    if (type.startsWith('audio')) return <FaFileAudio className="text-cyan-400" />;
    if (type === 'application/pdf') return <FaFilePdf className="text-cyan-400" />;
    return <FaFileAlt className="text-cyan-400" />;
  };

  const confidenceColor = report.isDeepfake ? 'text-red-400' : 'text-green-400';
  const score = report.visualAuthenticityScore ?? report.videoAuthenticityScore ?? report.audioAuthenticityScore ?? 0;

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
      <div className="p-6 flex items-center space-x-6 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="text-3xl">{getFileIcon(report.type)}</div>
        <div className="flex-1">
          <p className="font-semibold text-white truncate">{report.name}</p>
          <p className="text-sm text-gray-400">{(report.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
        <div className="flex items-center space-x-4">
            <div className={`text-lg font-bold ${confidenceColor}`}>
                {score}% Authentic
            </div>
            <div className="text-gray-400 text-2xl">
                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-700">
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Analysis Details</h3>
              <p className="text-sm text-gray-400 mb-4">{report.explanation}</p>
            </div>
            <div className="space-y-4">
                <div>
                    <p className="flex justify-between text-sm text-white"><span>Visual Authenticity</span> <span className={`${confidenceColor} font-semibold`}>{score}%</span></p>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                    <div className={`bg-gradient-to-r ${score > 50 ? 'from-green-500 to-green-400' : 'from-red-500 to-red-400'} h-2.5 rounded-full`} style={{ width: `${score}%` }}></div>
                    </div>
                </div>
                <div>
                    <p className="flex justify-between text-sm text-white"><span>Metadata Authenticity</span> <span className="text-blue-400 font-semibold">{report.metadataAuthenticityScore}%</span></p>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-2.5 rounded-full" style={{ width: `${report.metadataAuthenticityScore}%` }}></div>
                    </div>
                </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link href={`/dashboard/report/${report._id}`} className="inline-block bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-cyan-600 transition-colors duration-300">
                View Full Report
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisReport;
