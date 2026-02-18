'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

interface AnalysisResult {
  is_deepfake: boolean;
  confidence: number;
}

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);

    if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
    } else {
        setPreview(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/detect', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze file');
      }

      const data = await response.json();
      setAnalysis(data);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
      setAnalysis(null);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-8">
            <div 
                {...getRootProps()} 
                className={`flex justify-center items-center w-full h-64 px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer transition-all duration-300 ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
            >
                <input {...getInputProps()} />
                <div className="text-center">
                    {preview ? (
                        <Image src={preview} alt="Preview" width={192} height={192} className="mx-auto h-48 w-auto rounded-md" />
                    ) : (
                        <>
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600 mt-2">
                                <span className="font-medium text-blue-600 hover:text-blue-500">Upload a file</span>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                        </>
                    )}
                </div>
            </div>
            {file && <p className='text-center mt-4 text-gray-500'>Selected file: {file.name}</p>}
            <div className="mt-6">
                <button 
                    onClick={handleSubmit} 
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
                >
                    Analyze
                </button>
            </div>
            {error && <p className="text-red-500 mt-4 text-center animate-pulse">{error}</p>}
            {analysis && (
                <div className={`mt-6 p-4 rounded-lg shadow-inner ${analysis.is_deepfake ? 'bg-red-50' : 'bg-green-50'}`}>
                    <h3 className={`text-lg font-bold ${analysis.is_deepfake ? 'text-red-800' : 'text-green-800'}`}>Analysis Results</h3>
                    <div className="flex items-center mt-2">
                        <p className={`text-sm font-medium ${analysis.is_deepfake ? 'text-red-700' : 'text-green-700'}`}>
                            Deepfake Detected: 
                        </p>
                        <span className={`font-semibold ml-2 px-2 py-1 rounded-full text-xs ${analysis.is_deepfake ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>{analysis.is_deepfake ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex items-center mt-1">
                        <p className={`text-sm font-medium ${analysis.is_deepfake ? 'text-red-700' : 'text-green-700'}`}>
                            Confidence: 
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
                            <div className={`h-2.5 rounded-full ${analysis.is_deepfake ? 'bg-red-600' : 'bg-green-600'}`} style={{width: `${analysis.confidence * 100}%`}}></div>
                        </div>
                        <span className={`font-semibold ml-2 ${analysis.is_deepfake ? 'text-red-800' : 'text-green-800'}`}>{(analysis.confidence * 100).toFixed(2)}%</span>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}
