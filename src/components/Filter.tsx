'use client';

import React, { useState } from 'react';

const Filter = ({ onFilterChange }: { onFilterChange: (filter: string, customDate?: { startDate: string, endDate: string }) => void }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    if (filter !== 'custom') {
      onFilterChange(filter);
    }
  };

  const handleCustomDateApply = () => {
    if (customStartDate && customEndDate) {
      onFilterChange('custom', { startDate: customStartDate, endDate: customEndDate });
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
      <div className="flex space-x-2">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium ${activeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
          onClick={() => handleFilterClick('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium ${activeFilter === 'today' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
          onClick={() => handleFilterClick('today')}
        >
          Today
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium ${activeFilter === 'last7days' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
          onClick={() => handleFilterClick('last7days')}
        >
          Last 7 Days
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="date"
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          value={customStartDate}
          onChange={(e) => setCustomStartDate(e.target.value)}
        />
        <span className="text-gray-500 dark:text-gray-400">to</span>
        <input
          type="date"
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          value={customEndDate}
          onChange={(e) => setCustomEndDate(e.target.value)}
        />
        <button
          className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white"
          onClick={handleCustomDateApply}
          disabled={!customStartDate || !customEndDate}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default Filter;
