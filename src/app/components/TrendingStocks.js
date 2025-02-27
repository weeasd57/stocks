'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowUp, FaArrowDown, FaSpinner, FaSync } from 'react-icons/fa';
import { getTrendingStocks, checkBackendAvailability } from '../utils/api';
import { generateMockTrendingStocks } from '../utils/mockData';
import useAutoRefresh from '../hooks/useAutoRefresh';
import useOfflineDetection from '../hooks/useOfflineDetection';

const TrendingStocks = () => {
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

  // Use offline detection
  const { offline } = useOfflineDetection({
    onOffline: () => {
      setIsOfflineMode(true);
    },
    onOnline: () => {
      setIsOfflineMode(false);
      manualRefresh();
    }
  });

  // Use the auto-refresh hook to fetch trending stocks
  const { 
    data: trendingStocks, 
    loading, 
    error: apiError,
    lastUpdated: apiLastUpdated,
    manualRefresh,
    setEnabled 
  } = useAutoRefresh(
    async () => {
      // Track refresh count
      setRefreshCount(prev => prev + 1);
     
      try {
        // Check if backend is available
        await checkBackendAvailability();
        
        // Try to get data from backend
        const newData = await getTrendingStocks({ fallbackToMock: true });
        
        // If we got data, update the offline mode state
        setIsOfflineMode(false);
        
        // Preserve the order of existing stocks if we already have data
        if (trendingStocks && trendingStocks.length > 0) {
          // Create a map of symbols to their current positions
          const currentPositions = {};
          trendingStocks.forEach((stock, index) => {
            currentPositions[stock.symbol] = index;
          });
          
          // Create a map of current stocks for reference
          const currentStocksMap = {};
          trendingStocks.forEach(stock => {
            currentStocksMap[stock.symbol] = stock;
          });
          
          // Sort the new data to match the previous order
          return newData.map(newStock => {
            // If this stock existed before, preserve its position in the sorted array
            if (currentStocksMap[newStock.symbol]) {
              // Keep the position information from the current stock map
              return {
                ...newStock,
                position: currentPositions[newStock.symbol]
              };
            }
            // For new stocks, assign a position at the end
            return {
              ...newStock,
              position: Object.keys(currentPositions).length
            };
          }).sort((a, b) => {
            // Sort by the preserved position
            return a.position - b.position;
          });
        }
        
        return newData;
      } catch (error) {
        setIsOfflineMode(true);
        
        // Generate mock data if we don't have any
        if (!trendingStocks || trendingStocks.length === 0) {
          return generateMockTrendingStocks();
        }
        
        // Otherwise, return the existing data with updated values but same order
        return trendingStocks.map(stock => {
          const basePrice = stock.price;
          const change = (Math.random() * 10 - 3).toFixed(2);
          const changePercent = (change / basePrice * 100).toFixed(2);
          
          return {
            ...stock,
            change: parseFloat(change),
            changePercent: parseFloat(changePercent),
            isMockData: true
          };
        });
      }
    },
    1000, // Refresh every 1 seconds
    true, // Enabled by default
    []
  );

  // Update lastUpdated when apiLastUpdated changes
  useEffect(() => {
    if (apiLastUpdated) {
      setLastUpdated(apiLastUpdated);
    }
  }, [apiLastUpdated]);

  // Log refresh count for debugging
  useEffect(() => {
  }, [refreshCount]);

  // Format the last updated time
  const formatLastUpdated = (date) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  };

  // Handle error display
  const renderErrorMessage = () => {
    if (!apiError) return null;
    
    let message = 'Failed to load trending stocks';
    if (apiError.message && apiError.message.includes('timeout')) {
      message = 'Request timed out. Server may be busy or unavailable.';
    }
    
    return (
      <div className="bg-red-100 dark:bg-red-900 p-3 rounded-md mb-4 text-red-800 dark:text-red-200">
        <p className="flex items-center">
          <span className="mr-2">⚠️</span>
          {message}
        </p>
      </div>
    );
  };

  if (loading && !trendingStocks) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full">
        {renderErrorMessage()}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Trending Stocks</h2>
        <div className="flex justify-center items-center h-40">
          <FaSpinner className="animate-spin text-blue-500 text-2xl" />
        </div>
      </div>
    );
  }

  // Ensure we have valid data to render
  const stocksToDisplay = trendingStocks || generateMockTrendingStocks(10);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full">
      {renderErrorMessage()}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Trending Stocks</h2>
        <div className="flex items-center">
          {offline && (
            <span className="mr-3 text-yellow-500 dark:text-yellow-400 flex items-center">
              <span className="inline-block w-2 h-2 bg-yellow-500 dark:bg-yellow-400 rounded-full mr-1"></span>
              Offline
            </span>
          )}
          {isOfflineMode && !offline && (
            <span className="mr-3 text-gray-500 dark:text-gray-400 text-sm">Using cached data</span>
          )}
          {!offline && (
            <span className="text-xs text-gray-500 dark:text-gray-400 mr-3">
              Last updated: {formatLastUpdated(lastUpdated)}
              {loading && (
                <span className="ml-2 inline-flex items-center text-blue-500">
                  <svg className="animate-spin h-3 w-3 mr-1" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-xs">Refreshing</span>
                </span>
              )}
            </span>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stocksToDisplay.map((stock) => (
          <Link 
            href={`/stock/${stock.symbol}`} 
            key={stock.symbol}
            className="block bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{stock.symbol}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stock.name || 'Unknown Company'}</p>
              </div>
              <div className={`text-right ${(stock.changePercent || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                <p className="font-medium">${(stock.price || 0).toFixed(2)}</p>
                <p className="text-sm">
                  {(stock.changePercent || 0) >= 0 ? '+' : ''}{(stock.changePercent || 0).toFixed(2)}%
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingStocks;
