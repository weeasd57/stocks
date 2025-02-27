'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSpinner, FaArrowUp, FaArrowDown, FaFilter, FaCheck } from 'react-icons/fa';
import StockSearch from '../components/StockSearch';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState(['USA', 'EGY', 'KSA', 'UAE']);
  
  const regions = [
    { id: 'USA', name: 'United States', flag: '🇺🇸' },
    { id: 'EGY', name: 'Egypt', flag: '🇪🇬' },
    { id: 'KSA', name: 'Saudi Arabia', flag: '🇸🇦' },
    { id: 'UAE', name: 'United Arab Emirates', flag: '🇦🇪' },
    { id: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
    { id: 'EU', name: 'European Union', flag: '🇪🇺' },
    { id: 'CHN', name: 'China', flag: '🇨🇳' },
    { id: 'JPN', name: 'Japan', flag: '🇯🇵' },
  ];

  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real environment, this would fetch from the API
        // const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}&regions=${selectedRegions.join(',')}`);
        // setSearchResults(response.data);
        
        // Mock data for development
        setTimeout(() => {
          // Generate mock results based on query and selected regions
          const mockResults = [];
          
          if (selectedRegions.includes('USA')) {
            if ('apple'.includes(query.toLowerCase())) {
              mockResults.push({ 
                symbol: 'AAPL', 
                name: 'Apple Inc.', 
                region: 'USA', 
                exchange: 'NASDAQ',
                price: 182.52,
                change: 1.25,
                changePercent: 0.69,
                volume: 58432100,
                marketCap: 2850000000000
              });
            }
            if ('microsoft'.includes(query.toLowerCase())) {
              mockResults.push({ 
                symbol: 'MSFT', 
                name: 'Microsoft Corporation', 
                region: 'USA', 
                exchange: 'NASDAQ',
                price: 415.32,
                change: 2.78,
                changePercent: 0.67,
                volume: 22145600,
                marketCap: 3090000000000
              });
            }
            if ('amazon'.includes(query.toLowerCase())) {
              mockResults.push({ 
                symbol: 'AMZN', 
                name: 'Amazon.com Inc.', 
                region: 'USA', 
                exchange: 'NASDAQ',
                price: 178.75,
                change: 1.32,
                changePercent: 0.74,
                volume: 31254800,
                marketCap: 1850000000000
              });
            }
            if ('tesla'.includes(query.toLowerCase())) {
              mockResults.push({ 
                symbol: 'TSLA', 
                name: 'Tesla Inc.', 
                region: 'USA', 
                exchange: 'NASDAQ',
                price: 175.34,
                change: -3.21,
                changePercent: -1.80,
                volume: 98765400,
                marketCap: 556000000000
              });
            }
          }
          
          if (selectedRegions.includes('EGY')) {
            if ('commercial'.includes(query.toLowerCase()) || 'bank'.includes(query.toLowerCase())) {
              mockResults.push({ 
                symbol: 'COMI.CA', 
                name: 'Commercial International Bank', 
                region: 'EGY', 
                exchange: 'EGX',
                price: 52.15,
                change: 0.45,
                changePercent: 0.87,
                volume: 1245600,
                marketCap: 76000000000
              });
            }
            if ('telecom'.includes(query.toLowerCase()) || 'egypt'.includes(query.toLowerCase())) {
              mockResults.push({ 
                symbol: 'ETEL.CA', 
                name: 'Telecom Egypt', 
                region: 'EGY', 
                exchange: 'EGX',
                price: 24.32,
                change: -0.18,
                changePercent: -0.73,
                volume: 987600,
                marketCap: 41500000000
              });
            }
            if ('eastern'.includes(query.toLowerCase()) || 'tobacco'.includes(query.toLowerCase())) {
              mockResults.push({ 
                symbol: 'EAST.CA', 
                name: 'Eastern Company', 
                region: 'EGY', 
                exchange: 'EGX',
                price: 18.75,
                change: 0.25,
                changePercent: 1.35,
                volume: 756400,
                marketCap: 31200000000
              });
            }
          }
          
          if (selectedRegions.includes('KSA')) {
            if ('aramco'.includes(query.toLowerCase()) || 'saudi'.includes(query.toLowerCase()) || 'oil'.includes(query.toLowerCase())) {
              mockResults.push({ 
                symbol: '2222.SR', 
                name: 'Saudi Aramco', 
                region: 'KSA', 
                exchange: 'Tadawul',
                price: 29.85,
                change: 0.15,
                changePercent: 0.51,
                volume: 15678900,
                marketCap: 1790000000000
              });
            }
            if ('bank'.includes(query.toLowerCase()) || 'rajhi'.includes(query.toLowerCase())) {
              mockResults.push({ 
                symbol: '1120.SR', 
                name: 'Al Rajhi Bank', 
                region: 'KSA', 
                exchange: 'Tadawul',
                price: 89.70,
                change: 0.90,
                changePercent: 1.01,
                volume: 3245600,
                marketCap: 224000000000
              });
            }
          }
          
          if (selectedRegions.includes('UAE')) {
            if ('etisalat'.includes(query.toLowerCase()) || 'emirates'.includes(query.toLowerCase()) || 'telecom'.includes(query.toLowerCase())) {
              mockResults.push({ 
                symbol: 'ETISALAT.AD', 
                name: 'Emirates Telecommunications Group', 
                region: 'UAE', 
                exchange: 'ADX',
                price: 24.50,
                change: 0.10,
                changePercent: 0.41,
                volume: 2345600,
                marketCap: 213000000000
              });
            }
            if ('emaar'.includes(query.toLowerCase()) || 'property'.includes(query.toLowerCase()) || 'real'.includes(query.toLowerCase())) {
              mockResults.push({ 
                symbol: 'EMAAR.DU', 
                name: 'Emaar Properties', 
                region: 'UAE', 
                exchange: 'DFM',
                price: 7.25,
                change: -0.05,
                changePercent: -0.68,
                volume: 4567800,
                marketCap: 58700000000
              });
            }
          }
          
          setSearchResults(mockResults);
          setIsLoading(false);
        }, 1000); // Simulate network delay
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to load search results. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, selectedRegions]);

  const toggleRegion = (regionId) => {
    setSelectedRegions(prev => {
      if (prev.includes(regionId)) {
        // Don't allow deselecting all regions
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== regionId);
      } else {
        return [...prev, regionId];
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mr-4">
            <FaArrowLeft className="mr-2" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Search Results for "{query}"
          </h1>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3">
          <StockSearch />
        </div>
      </div>
      
      <div className="mb-6">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <FaFilter className="mr-2" />
          Filter by Region
        </button>
        
        {showFilters && (
          <div className="mt-2 p-4 bg-white dark:bg-gray-800 rounded-md shadow-md">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Select Markets</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {regions.map(region => (
                <button
                  key={region.id}
                  onClick={() => toggleRegion(region.id)}
                  className={`flex items-center justify-between px-3 py-2 text-sm rounded-md border ${
                    selectedRegions.includes(region.id) 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-2">{region.flag}</span>
                    <span>{region.name}</span>
                  </div>
                  {selectedRegions.includes(region.id) && (
                    <FaCheck className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
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
      ) : searchResults.length > 0 ? (
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Market
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
                {searchResults.map((stock) => {
                  const isPositive = stock.change >= 0;
                  const region = regions.find(r => r.id === stock.region);
                  
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          <span className="mr-1">{region?.flag}</span>
                          {stock.exchange}
                        </div>
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
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 w-full">
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">
            <p className="text-lg mb-2">No results found for "{query}"</p>
            <p>Try a different search term or adjust your region filters</p>
          </div>
        </div>
      )}
    </div>
  );
}
