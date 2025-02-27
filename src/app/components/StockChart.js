'use client';

import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { FiClock } from 'react-icons/fi';
import { getStockHistory, checkBackendAvailability } from '../utils/api';
import { generateMockStockHistory } from '../utils/mockData';
import useAutoRefresh from '../hooks/useAutoRefresh';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function StockChart({ symbol }) {
  const [timeRange, setTimeRange] = useState('1d');
  const [previousData, setPreviousData] = useState(null);
  
  // Use the auto-refresh hook to fetch stock history data
  const { 
    data: stockHistory, 
    loading, 
    error, 
    lastUpdated, 
    manualRefresh 
  } = useAutoRefresh(
    async () => {
      // First check if backend is available
      await checkBackendAvailability();
      
      // Then try to get data from backend
      try {
        const data = await getStockHistory(symbol, timeRange, { fallbackToMock: true });
        
        // If we got valid data, save it as previous data
        if (data && data.timestamps && data.timestamps.length > 0) {
          setPreviousData(data);
          return data;
        }
        
        // If we didn't get valid data but have previous data, use that
        if (previousData) {
          return previousData;
        }
        
        // Otherwise, use mock data
        return data;
      } catch (err) {
        // If we have previous data, use that instead of generating new mock data
        if (previousData) {
          return previousData;
        }
        throw err;
      }
    }, 
    1000, // Refresh every 5 seconds
    true,   // Enabled by default
    [symbol, timeRange] // Refresh when symbol or timeRange changes
  );

  // Format the last updated time
  const formatLastUpdated = (date) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  };

  // Use mock data if there's an error or no data
  const chartData = stockHistory || generateMockStockHistory(symbol, timeRange);
  
  // Ensure we have valid data arrays
  const timestamps = chartData?.timestamps || [];
  const prices = chartData?.prices || [];
  
  // Prepare data for the chart
  const data = {
    labels: timestamps,
    datasets: [
      {
        label: symbol,
        data: prices,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointRadius: 1,
        pointHoverRadius: 5,
        tension: 0.2,
        fill: true,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toFixed(2)}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 8,
          color: 'rgb(156, 163, 175)',
          autoSkip: true,
        },
      },
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          callback: function(value) {
            return '$' + value.toFixed(2);
          },
          precision: 2
        },
        beginAtZero: false,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  // Time range buttons
  const timeRanges = [
    { id: '1d', label: '1D' },
    { id: '5d', label: '5D' },
    { id: '1mo', label: '1M' },
    { id: '3mo', label: '3M' },
    { id: '6mo', label: '6M' },
    { id: '1y', label: '1Y' },
    { id: '5y', label: '5Y' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-md mb-4">
          <p>Error loading chart data. Using offline data.</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-1">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeRange === range.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {range.label}
            </button>
          ))}
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

      <div className="h-80">
        {loading && !stockHistory ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-full h-full"></div>
          </div>
        ) : timestamps.length === 0 || prices.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-gray-500 dark:text-gray-400">
            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No chart data available</p>
          </div>
        ) : (
          <Line data={data} options={options} />
        )}
      </div>
    </div>
  );
}
