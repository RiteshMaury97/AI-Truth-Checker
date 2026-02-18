'use client';

import React, { useState, useCallback, createRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Hero from '@/components/Hero';
import ResultCard from '@/components/ResultCard';
import ScannerAnimation from '@/components/ScannerAnimation';
import SampleFiles from '@/components/SampleFiles';
import FAQ from '@/components/FAQ';
import { MediaFile, AnalysisResult } from '@/types/media';
import { analyzeMedia } from '@/services/aiService';

interface MediaFileWithNodeRef extends MediaFile {
  fileNodeRef: React.RefObject<HTMLLIElement>;
  resultNodeRef: React.RefObject<HTMLDivElement>;
}

const HomePage: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFileWithNodeRef[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newMediaFiles: MediaFileWithNodeRef[] = acceptedFiles.map((file) => ({
      file,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      id: `${file.name}-${file.lastModified}`,
      fileNodeRef: createRef<HTMLLIElement>(),
      resultNodeRef: createRef<HTMLDivElement>(),
    }));
    setMediaFiles(newMediaFiles);
    setAnalysisResults([]);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDetection = async () => {
    if (mediaFiles.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const results = await Promise.all(
        mediaFiles.map(mediaFile => analyzeMedia(mediaFile))
      );
      setAnalysisResults(results);
    } catch (error) {
      setError('An error occurred during analysis. Please try again.');
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div>
      <Hero />
      <div className="container mx-auto p-4">
        <div {...getRootProps()} className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer mb-4 transition-all duration-300 ${isDragActive ? 'bg-indigo-100 dark:bg-indigo-900' : ''}`}>
          <input {...getInputProps()} />
          <p className="text-gray-500 dark:text-gray-400">{isDragActive ? "Drop the files here..." : "Drag 'n' drop some files here, or click to select files"}</p>
        </div>

        <TransitionGroup component="ul" className="list-disc pl-5 mb-4">
          {mediaFiles.map(mediaFile => (
            <CSSTransition
              key={mediaFile.id}
              nodeRef={mediaFile.fileNodeRef}
              timeout={300}
              classNames="file-item"
            >
              <li ref={mediaFile.fileNodeRef} className="text-gray-700 dark:text-gray-300">{mediaFile.file.name} - {mediaFile.file.size} bytes</li>
            </CSSTransition>
          ))}
        </TransitionGroup>

        <button onClick={handleDetection} disabled={loading || mediaFiles.length === 0} className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-all duration-300 transform hover:scale-105">
          {loading ? <span className="flex items-center"><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0-0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Analyzing...</span> : 'Analyze'}
        </button>

        {loading && <ScannerAnimation />}

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <TransitionGroup component={null}>
          {analysisResults.length > 0 && !loading && (
            <div className="mt-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Analysis Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {analysisResults.map((result, index) => {
                  const mediaFile = mediaFiles[index];
                  return (
                    <CSSTransition
                      key={mediaFile.id}
                      nodeRef={mediaFile.resultNodeRef}
                      timeout={500}
                      classNames="result-card"
                    >
                      <div ref={mediaFile.resultNodeRef}>
                        <ResultCard
                          fileName={mediaFile.file.name}
                          mediaType={mediaFile.type}
                          analysisResult={result}
                        />
                      </div>
                    </CSSTransition>
                  );
                })}
              </div>
            </div>
          )}
        </TransitionGroup>

        <SampleFiles />
        <FAQ />
      </div>
    </div>
  );
};

export default HomePage;
