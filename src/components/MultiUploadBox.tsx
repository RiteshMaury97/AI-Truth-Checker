
'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaFileImage, FaFileVideo, FaFileAudio, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation'; // Import the useRouter hook

const fileTypeIcons = {
  'image/': FaFileImage,
  'video/': FaFileVideo,
  'audio/': FaFileAudio,
};

const MultiUploadBox = () => {
  const [files, setFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const router = useRouter(); // Initialize the router

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles, fileRejections) => {
      setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
      setRejectedFiles(prevFiles => [...prevFiles, ...fileRejections]);
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

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      // Step 1: Upload files to get their URLs
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('File upload failed');
      }

      const uploadResult = await uploadResponse.json();

      // Step 2: Trigger analysis with the returned URLs
      const analysisResponse = await fetch('/api/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: uploadResult.files }),
      });

      if (!analysisResponse.ok) {
        throw new Error('Analysis request failed');
      }

      // Step 3: Redirect to the detection page to show the results
      router.push('/detection');

    } catch (error) {
      console.error('An error occurred:', error);
      // Handle errors (e.g., show a notification to the user)
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div {...getRootProps()} className={`p-8 border-4 border-dashed rounded-2xl text-center cursor-pointer transition-colors duration-300 ${isDragActive ? 'border-cyan-400 bg-gray-800' : 'border-gray-600 hover:border-cyan-500'}`}>
        <input {...getInputProps()} />
        <p className="text-2xl font-semibold text-gray-300">Drag & drop files here, or click to select</p>
        <p className="text-gray-500 mt-2">Image, Video, or Audio</p>
      </div>

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
