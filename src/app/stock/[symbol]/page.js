'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import StockChart from '../../components/StockChart';
import StockDetails from '../../components/StockDetails';

export default function StockPage() {
  const { symbol } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6">
        <FaArrowLeft className="mr-2" />
        Back to Home
      </Link>
      
      <div className="grid grid-cols-1 gap-6">
        <StockChart symbol={symbol} />
        <StockDetails symbol={symbol} />
      </div>
    </div>
  );
}
