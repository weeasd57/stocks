'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FaArrowUp, FaArrowDown, FaSpinner, FaArrowLeft } from 'react-icons/fa';

export default function TrendingPage() {
  const [trendingStocks, setTrendingStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingStocks = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real environment, this would fetch from the API
        // For now, let's use mock data since the backend is not running
        // const response = await axios.get('/api/trending?limit=50');
        // setTrendingStocks(response.data);
        
        // Mock data for development
        setTimeout(() => {
          setTrendingStocks([
            { 
              symbol: 'AAPL', 
              name: 'Apple Inc.', 
              price: 182.52, 
              change: 1.25, 
              changePercent: 0.69,
              volume: 58432100,
              marketCap: 2850000000000
            },
            { 
              symbol: 'MSFT', 
              name: 'Microsoft Corporation', 
              price: 415.32, 
              change: 2.78, 
              changePercent: 0.67,
              volume: 22145600,
              marketCap: 3090000000000
            },
            { 
              symbol: 'GOOGL', 
              name: 'Alphabet Inc.', 
              price: 142.65, 
              change: -0.87, 
              changePercent: -0.61,
              volume: 25698300,
              marketCap: 1790000000000
            },
            { 
              symbol: 'AMZN', 
              name: 'Amazon.com, Inc.', 
              price: 178.75, 
              change: 1.32, 
              changePercent: 0.74,
              volume: 31254800,
              marketCap: 1850000000000
            },
            { 
              symbol: 'TSLA', 
              name: 'Tesla, Inc.', 
              price: 175.34, 
              change: -3.21, 
              changePercent: -1.80,
              volume: 98765400,
              marketCap: 556000000000
            },
            { 
              symbol: 'NVDA', 
              name: 'NVIDIA Corporation', 
              price: 845.92, 
              change: 15.23, 
              changePercent: 1.83,
              volume: 45678900,
              marketCap: 2080000000000
            },
            { 
              symbol: 'META', 
              name: 'Meta Platforms, Inc.', 
              price: 472.28, 
              change: 3.45, 
              changePercent: 0.74,
              volume: 18765400,
              marketCap: 1210000000000
            },
            { 
              symbol: 'BRK.B', 
              name: 'Berkshire Hathaway Inc.', 
              price: 408.76, 
              change: -1.24, 
              changePercent: -0.30,
              volume: 3245600,
              marketCap: 890000000000
            },
            { 
              symbol: 'JPM', 
              name: 'JPMorgan Chase & Co.', 
              price: 198.45, 
              change: 2.34, 
              changePercent: 1.19,
              volume: 8765400,
              marketCap: 570000000000
            },
            { 
              symbol: 'V', 
              name: 'Visa Inc.', 
              price: 275.32, 
              change: 1.45, 
              changePercent: 0.53,
              volume: 5432100,
              marketCap: 560000000000
            }
          ]);
          setIsLoading(false);
        }, 1000); // Simulate network delay
      } catch (err) {
        console.error('Error fetching trending stocks:', err);
        setError('Failed to load trending stocks. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchTrendingStocks();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6">
        <FaArrowLeft className="mr-2" />
        Back to Home
      </Link>
      
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Trending Stocks</h1>
      
      {isLoading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full">
          <div className="flex justify-center items-center h-40">
            <FaSpinner className="animate-spin text-blue-500 text-2xl" />
          </div>
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full">
          <div className="text-red-500 text-center">{error}</div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Change
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Volume
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Market Cap
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {trendingStocks.map((stock) => {
                  const isPositive = stock && stock.change >= 0;
                  
                  return (
                    <tr key={stock.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/stock/${stock.symbol}`} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                          {stock.symbol}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">{stock.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-900 dark:text-gray-100">${stock.price?.toFixed(2) || '0.00'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className={`text-sm flex items-center justify-end ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          <span>
                            {isPositive ? '+' : ''}{stock.change?.toFixed(2) || '0.00'} ({stock.changePercent?.toFixed(2) || '0.00'}%)
                          </span>
                          {isPositive ? <FaArrowUp className="ml-1" /> : <FaArrowDown className="ml-1" />}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-900 dark:text-gray-100">{stock.volume?.toLocaleString() || '0'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          ${((stock.marketCap || 0) / 1000000000).toFixed(2)}B
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
