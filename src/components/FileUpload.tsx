'use client';

import { useState } from 'react';

interface AnalysisResult {
  is_deepfake: boolean;
  confidence: number;
}

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

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
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Upload a Video or Image</h2>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded-md w-full">Analyze</button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {analysis && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h3 className="text-xl font-bold">Analysis Results</h3>
          <p>Deepfake Detected: {analysis.is_deepfake ? 'Yes' : 'No'}</p>
          <p>Confidence: {analysis.confidence.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
