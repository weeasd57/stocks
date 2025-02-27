'use client';

import React from 'react';
import { FiArrowUp, FiArrowDown, FiClock } from 'react-icons/fi';
import { getStockDetails } from '../utils/api';
import { generateMockStockDetails } from '../utils/mockData';
import useAutoRefresh from '../hooks/useAutoRefresh';

export default function StockDetails({ symbol }) {
  // Use the auto-refresh hook to fetch stock details
  const { 
    data: stockDetails, 
    loading, 
    error, 
    lastUpdated, 
    manualRefresh 
  } = useAutoRefresh(
    () => getStockDetails(symbol, { fallbackToMock: true }), 
    1000, // Refresh every 5 seconds
    true,   // Enabled by default
    [symbol] // Refresh when symbol changes
  );

  // Format the last updated time
  const formatLastUpdated = (date) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  };

  if (loading && !stockDetails) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/5 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Use mock data if there's an error or no data
  const details = stockDetails || generateMockStockDetails(symbol);
  const isPositive = (details?.change || 0) >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-md mb-4">
          <p>Error loading stock details. Using offline data.</p>
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{details?.name || symbol}</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">{details?.exchange || 'Unknown'}: {symbol}</p>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <FiClock className="mr-1" />
          <span>Updated: {formatLastUpdated(lastUpdated)}</span>
          {loading && (
            <span className="ml-2 flex items-center text-blue-500">
              <svg className="animate-spin h-3 w-3 mr-1" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-xs">Refreshing</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex items-baseline mb-6">
        <h2 className="text-3xl font-bold mr-3 text-gray-900 dark:text-white">
          {details?.currency || '$'}{(details?.price || 0).toFixed(2)}
        </h2>
        <div className={`flex items-center ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {isPositive ? <FiArrowUp className="mr-1" /> : <FiArrowDown className="mr-1" />}
          <span className="font-medium">
            {(details?.change || 0) >= 0 ? '+' : ''}{(details?.change || 0).toFixed(2)} ({(details?.changePercent || 0) >= 0 ? '+' : ''}{(details?.changePercent || 0).toFixed(2)}%)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Previous Close</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">{(details?.previousClose || 0).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Open</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">{(details?.open || 0).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Day's Range</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            {(details?.dayLow || 0).toFixed(2)} - {(details?.dayHigh || 0).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Volume</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            {details?.volume ? details.volume.toLocaleString() : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            {details?.marketCap ? (details.marketCap / 1000000000).toFixed(2) + 'B' : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">52 Week Range</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            {(details?.yearLow || 0).toFixed(2)} - {(details?.yearHigh || 0).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">P/E Ratio</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">{(details?.pe || 0).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Dividend Yield</p>
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            {details?.dividendYield ? (details.dividendYield * 100).toFixed(2) + '%' : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}
