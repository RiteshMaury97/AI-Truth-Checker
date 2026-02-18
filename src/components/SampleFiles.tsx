import React from 'react';

const SampleFiles = () => {
  const sampleFiles = [
    { name: 'real_video.mp4', type: 'video', url: '#' },
    { name: 'fake_audio.mp3', type: 'audio', url: '#' },
    { name: 'real_image.jpg', type: 'image', url: '#' },
  ];

  return (
    <div className="my-8">
      <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">Try a Sample File</h3>
      <div className="flex justify-center space-x-4">
        {sampleFiles.map((file) => (
          <a key={file.name} href={file.url} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <p className="font-semibold text-gray-900 dark:text-white">{file.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{file.type}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SampleFiles;
