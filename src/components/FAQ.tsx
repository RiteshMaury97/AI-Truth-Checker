import React from 'react';

const faqs = [
  {
    question: 'What is a deepfake?',
    answer: 'A deepfake is a synthetic media in which a person in an existing image or video is replaced with someone else\'s likeness.',
  },
  {
    question: 'How does this tool work?',
    answer: 'This tool uses advanced AI algorithms to analyze media files for signs of manipulation. It looks for subtle inconsistencies and artifacts that are often present in deepfakes.',
  },
  {
    question: 'What types of files can I analyze?',
    answer: 'You can analyze video files (e.g., MP4), audio files (e.g., MP3), and image files (e.g., JPG, PNG).',
  },
  {
    question: 'Is the analysis 100% accurate?',
    answer: 'While our AI is highly accurate, no detection method is perfect. The results should be used as a strong indicator, but not as absolute proof.',
  },
];

const FAQ = () => {
  return (
    <div className="my-8">
      <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h3>
      <div className="space-y-4 max-w-2xl mx-auto">
        {faqs.map((faq) => (
          <details key={faq.question} className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md">
            <summary className="font-semibold cursor-pointer text-gray-900 dark:text-white">{faq.question}</summary>
            <p className="mt-2 text-gray-700 dark:text-gray-300">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
