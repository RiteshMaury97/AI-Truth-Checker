'use client';

import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" legacyBehavior>
              <a className="text-xl font-bold text-gray-900 dark:text-white">Deepfake Detector</a>
            </Link>
          </div>
          <div className="flex items-center">
            <Link href="/" legacyBehavior>
              <a className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Home</a>
            </Link>
            <Link href="/dashboard" legacyBehavior>
              <a className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</a>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
