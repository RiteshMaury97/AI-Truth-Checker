
'use client';

import { useState } from 'react';
import { FaFileVideo, FaFileAudio, FaFileImage, FaChevronDown, FaChevronUp, FaFileAlt, FaLightbulb } from 'react-icons/fa';

const AnalysisReport = ({ report }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getFileIcon = (type) => {
    if (type.startsWith('image')) return <FaFileImage className="text-cyan-400" />;
    if (type.startsWith('video')) return <FaFileVideo className="text-cyan-400" />;
    if (type.startsWith('audio')) return <FaFileAudio className="text-cyan-400" />;
    return <FaFileAlt className="text-cyan-400" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Likely Authentic':
        return 'text-green-400';
      case 'Suspicious':
        return 'text-yellow-400';
      case 'Likely AI Generated / Fabricated':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const statusColor = getStatusColor(report.authenticityStatus);

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
      <div className="p-6 flex items-center space-x-6 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="text-3xl">{getFileIcon(report.mediaType)}</div>
        <div className="flex-1">
          <p className="font-semibold text-white truncate">{report.fileName}</p>
        </div>
        <div className="flex items-center space-x-4">
            <div className={`text-lg font-bold ${statusColor}`}>
                {report.authenticityStatus}
            </div>
            <div className="text-gray-400 text-2xl">
                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-700">
            <div className="mt-6">
                <h3 className="text-xl font-bold text-white mb-4">Forensic Analysis Summary</h3>
                <p className="text-gray-300 leading-relaxed">{report.explanation}</p>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <p className="flex justify-between text-sm text-white"><span>Overall Authenticity</span> <span className={`${statusColor} font-semibold`}>{report.authenticityPercentage.toFixed(2)}%</span></p>
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                        <div className={`bg-gradient-to-r ${report.authenticityPercentage > 70 ? 'from-green-500 to-green-400' : report.authenticityPercentage > 40 ? 'from-yellow-500 to-yellow-400' : 'from-red-500 to-red-400'} h-2.5 rounded-full`} style={{ width: `${report.authenticityPercentage}%` }}></div>
                        </div>
                    </div>
                    {report.visualScore !== null && (
                        <div>
                        <p className="flex justify-between text-sm text-white"><span>Visual Score</span> <span className="font-semibold">{report.visualScore}%</span></p>
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                            <div className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-2.5 rounded-full" style={{ width: `${report.visualScore}%` }}></div>
                        </div>
                        </div>
                    )}
                    {report.audioScore !== null && (
                        <div>
                        <p className="flex justify-between text-sm text-white"><span>Audio Score</span> <span className="font-semibold">{report.audioScore}%</span></p>
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                            <div className="bg-gradient-to-r from-purple-500 to-purple-400 h-2.5 rounded-full" style={{ width: `${report.audioScore}%` }}></div>
                        </div>
                        </div>
                    )}
                    <div>
                        <p className="flex justify-between text-sm text-white"><span>Metadata Score</span> <span className="font-semibold">{report.metadataScore}%</span></p>
                        <div className="w-full bg-gray-700 rounded--full h-2.5 mt-1">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-2.5 rounded-full" style={{ width: `${report.metadataScore}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-3 flex items-center"><FaLightbulb className="mr-2 text-yellow-300"/>Verification Tips</h4>
                    <ul className="space-y-2">
                        {report.verificationTips.map((tip, index) => (
                            <li key={index} className="text-gray-300 text-sm">- {tip}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisReport;
