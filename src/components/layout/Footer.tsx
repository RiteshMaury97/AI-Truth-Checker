
import React from 'react';
import { FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">AI Deepfake Detector</h3>
            <p className="text-sm">A project for the Firebase AI Hackathon.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Team</h4>
            <ul className="space-y-2 text-sm">
              <li>Team Member 1</li>
              <li>Team Member 2</li>
              <li>Team Member 3</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
            <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300">
              <FaGithub className="text-2xl" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} AI Deepfake Detector. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
