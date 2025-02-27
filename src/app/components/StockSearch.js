'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaSearch, FaGlobe, FaChevronDown, FaCheck } from 'react-icons/fa';

const StockSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState(['USA']); // Default to USA
  const searchRef = useRef(null);
  const regionDropdownRef = useRef(null);
  const router = useRouter();

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target)) {
        setShowRegionDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchRef, regionDropdownRef]);

  // Search for stocks when query or selected regions change
  useEffect(() => {
    const searchStocks = async () => {
      if (query.length < 1) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        // In a real environment, this would fetch from the API with region filters
        // const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}&regions=${selectedRegions.join(',')}`);
        // setResults(response.data);
        
        // Mock data for development
        setTimeout(() => {
          // Generate mock results based on query and selected regions
          const mockResults = [];
          
          if (selectedRegions.includes('USA')) {
            if ('apple'.includes(query.toLowerCase())) {
              mockResults.push({ symbol: 'AAPL', name: 'Apple Inc.', region: 'USA', exchange: 'NASDAQ' });
            }
            if ('microsoft'.includes(query.toLowerCase())) {
              mockResults.push({ symbol: 'MSFT', name: 'Microsoft Corporation', region: 'USA', exchange: 'NASDAQ' });
            }
            if ('amazon'.includes(query.toLowerCase())) {
              mockResults.push({ symbol: 'AMZN', name: 'Amazon.com Inc.', region: 'USA', exchange: 'NASDAQ' });
            }
            if ('tesla'.includes(query.toLowerCase())) {
              mockResults.push({ symbol: 'TSLA', name: 'Tesla Inc.', region: 'USA', exchange: 'NASDAQ' });
            }
          }
          
          if (selectedRegions.includes('EGY')) {
            if ('commercial'.includes(query.toLowerCase())) {
              mockResults.push({ symbol: 'COMI.CA', name: 'Commercial International Bank', region: 'EGY', exchange: 'EGX' });
            }
            if ('telecom'.includes(query.toLowerCase()) || 'egypt'.includes(query.toLowerCase())) {
              mockResults.push({ symbol: 'ETEL.CA', name: 'Telecom Egypt', region: 'EGY', exchange: 'EGX' });
            }
            if ('eastern'.includes(query.toLowerCase())) {
              mockResults.push({ symbol: 'EAST.CA', name: 'Eastern Company', region: 'EGY', exchange: 'EGX' });
            }
          }
          
          if (selectedRegions.includes('KSA')) {
            if ('aramco'.includes(query.toLowerCase()) || 'saudi'.includes(query.toLowerCase())) {
              mockResults.push({ symbol: '2222.SR', name: 'Saudi Aramco', region: 'KSA', exchange: 'Tadawul' });
            }
            if ('bank'.includes(query.toLowerCase()) || 'rajhi'.includes(query.toLowerCase())) {
              mockResults.push({ symbol: '1120.SR', name: 'Al Rajhi Bank', region: 'KSA', exchange: 'Tadawul' });
            }
          }
          
          if (selectedRegions.includes('UAE')) {
            if ('etisalat'.includes(query.toLowerCase()) || 'emirates'.includes(query.toLowerCase())) {
              mockResults.push({ symbol: 'ETISALAT.AD', name: 'Emirates Telecommunications Group', region: 'UAE', exchange: 'ADX' });
            }
            if ('emaar'.includes(query.toLowerCase())) {
              mockResults.push({ symbol: 'EMAAR.DU', name: 'Emaar Properties', region: 'UAE', exchange: 'DFM' });
            }
          }
          
          setResults(mockResults);
          setIsLoading(false);
        }, 300);
      } catch (error) {
        console.error('Error searching stocks:', error);
        setResults([]);
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchStocks, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, selectedRegions]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query) {
      router.push(`/stock/${query.toUpperCase()}`);
      setQuery('');
      setShowResults(false);
    }
  };

  const handleStockSelect = (symbol) => {
    router.push(`/stock/${symbol}`);
    setQuery('');
    setShowResults(false);
  };

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
    <div className="relative" ref={searchRef}>
      <div className="flex">
        <div className="relative flex-grow">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              placeholder="Search stocks..."
              className="w-full px-4 py-2 pl-10 pr-4 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
          </form>
        </div>
        
        <div className="relative" ref={regionDropdownRef}>
          <button
            onClick={() => setShowRegionDropdown(!showRegionDropdown)}
            className="flex items-center justify-center px-4 py-2 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FaGlobe className="mr-2" />
            <span className="hidden sm:inline">Regions</span>
            <FaChevronDown className="ml-2 h-3 w-3" />
          </button>
          
          {showRegionDropdown && (
            <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-20">
              <div className="p-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Select Markets</h3>
                <div className="space-y-1">
                  {regions.map(region => (
                    <button
                      key={region.id}
                      onClick={() => toggleRegion(region.id)}
                      className="flex items-center justify-between w-full px-3 py-2 text-left text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <span className="mr-2">{region.flag}</span>
                        <span>{region.name}</span>
                      </div>
                      {selectedRegions.includes(region.id) && (
                        <FaCheck className="h-4 w-4 text-green-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showResults && query.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading...</div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((stock) => (
                <li key={stock.symbol}>
                  <button
                    onClick={() => handleStockSelect(stock.symbol)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                  >
                    <div className="flex justify-between">
                      <div className="font-medium text-gray-800 dark:text-gray-200">{stock.symbol}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {regions.find(r => r.id === stock.region)?.flag} {stock.exchange}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{stock.name}</div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockSearch;
