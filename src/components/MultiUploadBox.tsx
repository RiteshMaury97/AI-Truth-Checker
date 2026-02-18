'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { MediaFile, MediaType, AnalysisResult } from '@/types/media';
import { analyzeMedia } from '@/services/aiService';

const getMediaType = (file: File): MediaType => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('audio/')) return 'audio';
  return 'image'; // default to image for unknown types
};

const FileIcon = ({ mediaType }: { mediaType: MediaType }) => {
  if (mediaType === 'image') {
    return <>🖼️</>;
  }
  if (mediaType === 'video') {
    return <>🎥</>;
  }
  if (mediaType === 'audio') {
    return <>🎵</>;
  }
  return <>📄</>;
};

export default function MultiUploadBox() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newMediaFiles: MediaFile[] = acceptedFiles.map(file => ({
      fileName: file.name,
      mediaType: getMediaType(file),
      file,
    }));
    setFiles(prevFiles => [...prevFiles, ...newMediaFiles]);
  }, []);

  const removeFile = (fileToRemove: MediaFile) => {
    setFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  };

  const handleAnalyze = async () => {
    if (files.length === 0) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResults([]);

    try {
      const results = await Promise.all(
        files.map(file => analyzeMedia(file))
      );
      setAnalysisResults(results);
    } catch (err) {
      setError('An error occurred during analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'video/*': [],
      'audio/*': [],
    },
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`w-full p-8 border-2 border-dashed rounded-lg text-center cursor-pointer
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-600">Drop the files here ...</p>
        ) : (
          <p className="text-gray-500">Drag & drop some files here, or click to select files</p>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Selected Files:</h3>
          <ul className="space-y-4">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl"><FileIcon mediaType={file.mediaType} /></span>
                  <div>
                    <p className="font-semibold">{file.fileName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{(file.file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8 text-center">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || files.length === 0}
              className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Files'}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-8 p-4 bg-red-100 text-red-700 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      {analysisResults.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Analysis Results:</h3>
          <ul className="space-y-4">
            {analysisResults.map((result, index) => (
              <li key={index} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="font-semibold">{files[index].fileName}</p>
                <p>Result: <span className={result.result === 'fake' ? 'text-red-500' : 'text-green-500'}>{result.result}</span></p>
                <p>Fabrication Percentage: {result.fabricationPercentage}%</p>
                <p>Explanation: {result.explanation}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
