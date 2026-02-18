'use client';

import React, { useState, useMemo } from 'react';
import { AnalysisResult, MediaType, MediaUpload } from '@/types/media';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Modal from 'react-modal';

Modal.setAppElement('#__next');

const AnalysisTable = ({ data }: { data: MediaUpload[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<MediaType | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);

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
        Time: new Date(item.uploadDate).toLocaleString(),
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
            new Date(item.uploadDate).toLocaleString(),
        ]),
    });
    doc.save('analysis_report.pdf');
  };

  const openModal = (analysis: AnalysisResult) => {
    setSelectedAnalysis(analysis);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedAnalysis(null);
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Details</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {filteredData.map((item) => (
                    <tr key={item.imagekitFileId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.fileName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {item.mediaType === 'image' && <img src={item.imagekitUrl} alt={item.fileName} className="w-24 h-24 object-cover" />}
                            {item.mediaType === 'video' && <video src={item.imagekitUrl} controls className="w-24 h-24" />}
                            {item.mediaType === 'audio' && <audio src={item.imagekitUrl} controls />}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.mediaType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{(item.analysisResult.fabricationPercentage * 100).toFixed(2)}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{getRiskLevel(item.analysisResult.fabricationPercentage * 100)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(item.uploadDate).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button onClick={() => openModal(item.analysisResult)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">
                                Details
                            </button>
                        </td>
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

        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Analysis Details"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-lg mx-auto my-12"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
            {selectedAnalysis && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Analysis Details</h2>
                    <p className="mb-4"><strong>Explanation:</strong> {selectedAnalysis.explanation}</p>
                    <div>
                        <h3 className="text-lg font-bold mb-2">Scores:</h3>
                        <ul className="list-disc list-inside">
                            {Object.entries(selectedAnalysis.scores).map(([key, value]) => (
                                <li key={key}>{key}: {value}</li>
                            ))}
                        </ul>
                    </div>
                    <button onClick={closeModal} className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Close</button>
                </div>
            )}
        </Modal>
    </div>
  );
};

export default AnalysisTable;
