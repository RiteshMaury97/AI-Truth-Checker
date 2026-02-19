
'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaFileImage, FaFileVideo, FaFileAudio, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const fileTypeIcons = {
  'image/': FaFileImage,
  'video/': FaFileVideo,
  'audio/': FaFileAudio,
};

const MultiUploadBox = ({ onAnalysisComplete }) => {
  const [files, setFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles, fileRejections) => {
      setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
      setRejectedFiles(prevFiles => [...prevFiles, ...fileRejections]);
      setError(null);
      onAnalysisComplete(null); // Clear previous results
    },
    accept: {
      'image/*': [],
      'video/*': [],
      'audio/*': [],
    },
  });

  const removeFile = (file) => {
    setFiles(files.filter(f => f !== file));
  };

  const handleAnalyze = async () => {
    if (files.length === 0) return;
    setError(null);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({ message: 'File upload failed' }));
        throw new Error(errorData.message);
      }

      const uploadResult = await uploadResponse.json();

      const analysisResponse = await fetch('/api/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: uploadResult.files }),
      });

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json().catch(() => ({ message: 'Analysis request failed' }));
        throw new Error(errorData.message);
      }

      const analysisResult = await analysisResponse.json();
      onAnalysisComplete(analysisResult.reports);

    } catch (err) {
      console.error('An error occurred:', err);
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div {...getRootProps()} className={`p-8 border-4 border-dashed rounded-2xl text-center cursor-pointer transition-colors duration-300 ${isDragActive ? 'border-cyan-400 bg-gray-800' : 'border-gray-600 hover:border-cyan-500'}`}>
        <input {...getInputProps()} />
        <p className="text-2xl font-semibold text-gray-300">Drag & drop files here, or click to select</p>
        <p className="text-gray-500 mt-2">Image, Video, or Audio</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 bg-red-900 border border-red-700 rounded-lg text-white flex items-center space-x-4"
        >
          <FaExclamationTriangle className="text-2xl" />
          <div>
            <p className="font-bold">An error occurred:</p>
            <p>{error}</p>
            <button onClick={() => setError(null)} className="mt-2 px-3 py-1 bg-red-700 hover:bg-red-600 rounded font-semibold">Clear</button>
          </div>
        </motion.div>
      )}

      <div className="mt-8">
        {files.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((file, index) => {
              const Icon = fileTypeIcons[Object.keys(fileTypeIcons).find(key => file.type.startsWith(key))] || FaFileImage;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative bg-gray-800 p-4 rounded-lg shadow-lg flex items-center space-x-4"
                >
                  <Icon className="text-3xl text-cyan-400" />
                  <span className="text-white truncate flex-1">{file.name}</span>
                  <button onClick={() => removeFile(file)} className="text-gray-400 hover:text-white">
                    <FaTimes />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <motion.button
          onClick={handleAnalyze}
          disabled={files.length === 0}
          whileHover={{ scale: 1.05 }}
          className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform transition-transform duration-300"
        >
          Analyze Files
        </motion.button>
      </div>
    </div>
  );
};

export default MultiUploadBox;
