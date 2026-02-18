'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FileIcon = ({ type }: { type: string }) => {
  if (type.startsWith('image/')) {
    return <>🖼️</>;
  }
  if (type.startsWith('video/')) {
    return <>🎥</>;
  }
  if (type.startsWith('audio/')) {
    return <>🎵</>;
  }
  return <>📄</>;
};

export default function MultiUploadBox() {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  }, []);

  const removeFile = (fileToRemove: File) => {
    setFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
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
                  <span className="text-2xl"><FileIcon type={file.type} /></span>
                  <div>
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
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
        </div>
      )}
    </div>
  );
}
