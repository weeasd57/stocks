'use client';

import React from 'react';
import Link from 'next/link';
import { FaChartLine } from 'react-icons/fa';
import StockSearch from './StockSearch';
import { ThemeToggle } from './ThemeToggle';

const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <FaChartLine className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">StockTracker</span>
            </Link>
          </div>
          
          <div className="w-full md:w-1/2 lg:w-1/3">
            <StockSearch />
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
