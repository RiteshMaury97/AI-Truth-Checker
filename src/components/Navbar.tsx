import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 z-10 shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800"><Link href="/">AI Deepfake Detector</Link></h1>
        <ul className="hidden md:flex space-x-6 items-center">
          <li><Link href="/" className="text-gray-600 hover:text-gray-800 transition-colors duration-300">Home</Link></li>
          <li><Link href="/detection" className="text-gray-600 hover:text-gray-800 transition-colors duration-300">Detection</Link></li>
          <li><Link href="/report" className="text-gray-600 hover:text-gray-800 transition-colors duration-300">Report</Link></li>
          <li><Link href="/about" className="text-gray-600 hover:text-gray-800 transition-colors duration-300">About</Link></li>
        </ul>
        <button className="md:hidden flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
