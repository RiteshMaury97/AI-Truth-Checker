'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Hero from '@/components/Hero';
import ResultCard from '@/components/ResultCard';
import { MediaFile, AnalysisResult } from '@/types/media';

const HomePage: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newMediaFiles = acceptedFiles.map((file) => ({
      file,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      id: `${file.name}-${file.lastModified}`,
    }));
    setMediaFiles(newMediaFiles);
    setAnalysisResults([]); // Clear previous results
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDetection = async () => {
    if (mediaFiles.length === 0) return;

    setLoading(true);
    const formData = new FormData();
    mediaFiles.forEach((mediaFile) => {
      formData.append('file', mediaFile.file);
    });

    try {
      const response = await fetch('/api/detect', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const results = await response.json();
        setAnalysisResults(results);
      } else {
        console.error('Failed to get analysis results');
      }
    } catch (error) {
      console.error('Error during detection:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Hero />
      <div className="container mx-auto p-4">
        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer mb-4">
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p>Drop the files here ...</p> :
              <p>Drag 'n' drop some files here, or click to select files</p>
          }
        </div>
        <aside>
          <h4>Files</h4>
          <ul>
            {mediaFiles.map(mediaFile => (
              <li key={mediaFile.id}>{mediaFile.file.name} - {mediaFile.file.size} bytes</li>
            ))}
          </ul>
        </aside>
        <button onClick={handleDetection} disabled={loading || mediaFiles.length === 0} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 disabled:bg-gray-400">
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>

        {analysisResults.length > 0 && (
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
                {analysisResults.map((result, index) => (
                    <ResultCard
                        key={mediaFiles[index].id}
                        fileName={mediaFiles[index].file.name}
                        mediaType={mediaFiles[index].type}
                        analysisResult={result}
                    />
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
