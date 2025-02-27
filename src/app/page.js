'use client';

import React from 'react';
import Link from 'next/link';
import StockSearch from './components/StockSearch';
import TrendingStocks from './components/TrendingStocks';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-12 md:py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Your Comprehensive Stock Analysis Platform
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Track, analyze, and make informed decisions with real-time stock data and powerful visualization tools.
        </p>
        
      </section>

      {/* Trending Stocks Section */}
      <section className="py-8">
        <TrendingStocks />
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800 dark:text-white">
          Powerful Features for Stock Analysis
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-blue-600 dark:text-blue-400 text-3xl mb-4">
              📊
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              Real-Time Data
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Access up-to-date stock information with real-time price updates and market data.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-blue-600 dark:text-blue-400 text-3xl mb-4">
              📈
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              Interactive Charts
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Visualize stock performance with customizable, interactive charts for better analysis.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-blue-600 dark:text-blue-400 text-3xl mb-4">
              🔍
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              Comprehensive Search
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Find any stock quickly with our powerful search functionality and get detailed information.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
