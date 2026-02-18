'use client';

import React, { useState, useMemo } from 'react';
import { AnalysisResult, MediaType } from '@/types/media';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface AnalysisData {
  id: string;
  fileName: string;
  mediaType: MediaType;
  analysisResult: AnalysisResult;
  timestamp: string;
}

const AnalysisTable = ({ data }: { data: AnalysisData[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<MediaType | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');

  const filteredData = useMemo(() => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((item) => item.mediaType === filterType);
    }

    if (sortOrder !== 'none') {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a.analysisResult.fabricationPercentage;
        const bValue = b.analysisResult.fabricationPercentage;
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    return filtered;
  }, [data, searchTerm, filterType, sortOrder]);

  const getRiskLevel = (percentage: number) => {
    if (percentage < 30) {
      return 'Low';
    }
    if (percentage < 70) {
      return 'Medium';
    }
    return 'High';
  };

  const handleExportCSV = () => {
    const csvData = filteredData.map(item => ({
        FileName: item.fileName,
        Type: item.mediaType,
        FabricationPercentage: (item.analysisResult.fabricationPercentage * 100).toFixed(2) + '%',
        RiskLevel: getRiskLevel(item.analysisResult.fabricationPercentage * 100),
        Time: new Date(item.timestamp).toLocaleString(),
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'analysis_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Analysis Report', 20, 10);
    (doc as any).autoTable({
        head: [['File Name', 'Type', 'Fabrication %', 'Risk Level', 'Time']],
        body: filteredData.map(item => [
            item.fileName,
            item.mediaType,
            (item.analysisResult.fabricationPercentage * 100).toFixed(2) + '%',
            getRiskLevel(item.analysisResult.fabricationPercentage * 100),
            new Date(item.timestamp).toLocaleString(),
        ]),
    });
    doc.save('analysis_report.pdf');
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="w-full md:w-1/3 mb-4 md:mb-0">
                <input
                type="text"
                placeholder="Search by file name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>
            <div className="flex items-center space-x-4">
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as MediaType | 'all')}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    <option value="all">All Types</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                </select>
                <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    Sort by Fabrication % {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
            </div>
        </div>

        <div className="flex justify-end mb-4">
            <button onClick={handleExportCSV} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                Export as CSV
            </button>
            <button onClick={handleExportPDF} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Export as PDF
            </button>
        </div>

        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">File Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Preview</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Fabrication %</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Risk Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Time</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {filteredData.map((item) => (
                    <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.fileName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {item.mediaType === 'image' && <img src={`/uploads/${item.fileName}`} alt={item.fileName} className="w-24 h-24 object-cover" />}
                            {item.mediaType === 'video' && <video src={`/uploads/${item.fileName}`} controls className="w-24 h-24" />}
                            {item.mediaType === 'audio' && <audio src={`/uploads/${item.fileName}`} controls />}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.mediaType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{(item.analysisResult.fabricationPercentage * 100).toFixed(2)}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{getRiskLevel(item.analysisResult.fabricationPercentage * 100)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(item.timestamp).toLocaleString()}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {filteredData.length > 0 && (
            <div className="mt-6">
                <h3 className="text-lg font-bold">Summary Statistics</h3>
                <p>Total Files: {filteredData.length}</p>
                <p>Average Fabrication: {(filteredData.reduce((acc, item) => acc + item.analysisResult.fabricationPercentage, 0) / filteredData.length * 100).toFixed(2)}%</p>
            </div>
        )}
    </div>
  );
};

export default AnalysisTable;
