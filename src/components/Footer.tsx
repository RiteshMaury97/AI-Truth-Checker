import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 pt-16 pb-8">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/4 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">AI Deepfake Detector</h2>
            <p className="text-gray-400 text-sm">Combatting misinformation with technology.</p>
          </div>
          <div className="w-full md:w-3/4 mt-8 md:mt-0">
            <div className="flex flex-wrap justify-center md:justify-end">
              <div className="w-full sm:w-1/2 md:w-1/4 mb-8 md:mb-0">
                <h5 className="font-bold uppercase mb-4">Product</h5>
                <ul>
                  <li><Link href="/detection" className="text-gray-400 hover:text-white transition-colors duration-300">Detection</Link></li>
                  <li><Link href="/report" className="text-gray-400 hover:text-white transition-colors duration-300 mt-2 block">Report</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300 mt-2 block">Pricing</Link></li>
                </ul>
              </div>
              <div className="w-full sm:w-1/2 md:w-1/4 mb-8 md:mb-0">
                <h5 className="font-bold uppercase mb-4">Company</h5>
                <ul>
                  <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors duration-300">About Us</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300 mt-2 block">Blog</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300 mt-2 block">Careers</Link></li>
                </ul>
              </div>
              <div className="w-full sm:w-1/2 md:w-1/4">
                <h5 className="font-bold uppercase mb-4">Legal</h5>
                <ul>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors duration-300 mt-2 block">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm text-center md:text-left mb-4 md:mb-0">&copy; 2024 AI Deepfake Detector. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transform hover:scale-110 transition-transform duration-300"><img src="/twitter.svg" alt="Twitter" className="w-6 h-6" /></a>
            <a href="#" className="text-gray-400 hover:text-white transform hover:scale-110 transition-transform duration-300"><img src="/github.svg" alt="GitHub" className="w-6 h-6" /></a>
            <a href="#" className="text-gray-400 hover:text-white transform hover:scale-110 transition-transform duration-300"><img src="/linkedin.svg" alt="LinkedIn" className="w-6 h-6" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
