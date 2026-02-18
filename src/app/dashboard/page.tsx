'use client';

import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import Filter from '@/components/Filter';
import Pagination from '@/components/Pagination';
import { EnrichedMediaUpload } from '@/types/media';

const ReportCard = lazy(() => import('@/components/ReportCard'));

const DashboardPage = () => {
  const [analysisData, setAnalysisData] = useState<Record<string, EnrichedMediaUpload[]>>({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [customDateRange, setCustomDateRange] = useState<{ startDate: string, endDate: string } | undefined>();

  const getAnalysisData = useCallback(async (filter: string, customDate?: { startDate: string, endDate: string }, page: number = 1) => {
    setLoading(true);
    let url = '/api/dashboard/reports';

    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', '12');

    if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      params.append('startDate', today);
      params.append('endDate', today);
    } else if (filter === 'last7days') {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);
      params.append('startDate', startDate.toISOString().split('T')[0]);
      params.append('endDate', endDate);
    } else if (filter === 'custom' && customDate) {
      params.append('startDate', customDate.startDate);
      params.append('endDate', customDate.endDate);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    try {
      const res = await fetch(url);
      const { data, pagination } = await res.json();
      setAnalysisData(data);
      setTotalPages(pagination.totalPages);
      setCurrentPage(pagination.currentPage);
    } catch (error) {
      console.error('Error fetching analysis data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAnalysisData(currentFilter, customDateRange, currentPage);
  }, [getAnalysisData, currentFilter, customDateRange, currentPage]);

  const handleFilterChange = (filter: string, customDate?: { startDate: string, endDate: string }) => {
    setCurrentFilter(filter);
    setCustomDateRange(customDate);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Analysis Dashboard</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Browse, search, and filter all your analysis records.</p>
        </div>

        <Filter onFilterChange={handleFilterChange} />

        {loading ? (
          <div className="text-center"><p>Loading...</p></div>
        ) : Object.keys(analysisData).length > 0 ? (
          <>
            <Suspense fallback={<div>Loading cards...</div>}>
              {Object.entries(analysisData).map(([date, reports]) => (
                <div key={date}>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 my-8">{new Date(date).toDateString()}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {reports.map((report) => (
                      <ReportCard key={report.analysisReportId} report={report} />
                    ))}
                  </div>
                </div>
              ))}
            </Suspense>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        ) : (
          <div className="text-center"><p>No analysis reports found for the selected period.</p></div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
