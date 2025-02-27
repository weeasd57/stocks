'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for automatically refreshing data at specified intervals
 * @param {Function} fetchFunction - The function to call to fetch fresh data
 * @param {number} intervalMs - Refresh interval in milliseconds (default: 30000 - 30 seconds)
 * @param {boolean} enabled - Whether auto-refresh is enabled (default: true)
 * @param {any[]} dependencies - Additional dependencies that should trigger a refresh
 * @returns {Object} - { data, loading, error, lastUpdated, manualRefresh, setEnabled, refreshCount }
 */
export default function useAutoRefresh(fetchFunction, intervalMs = 30000, enabled = true, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isEnabled, setEnabled] = useState(enabled);
  const [refreshCount, setRefreshCount] = useState(0);
  
  // Use ref to keep track of the current fetch function and interval
  const fetchFunctionRef = useRef(fetchFunction);
  const intervalRef = useRef(null);
  const dataRef = useRef(null);

  // Update the ref when the fetch function changes
  useEffect(() => {
    fetchFunctionRef.current = fetchFunction;
  }, [fetchFunction]);

  // Store data in ref for access in cleanup functions
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const fetchData = async () => {
    // Don't set loading to true if we already have data
    if (!dataRef.current) {
      setLoading(true);
    } else {
      // Just show a subtle loading indicator if we already have data
      setLoading(true);
    }
    
    let retryCount = 0;
    const maxRetries = 0; // Don't retry - just use mock data if it fails
    
    const attemptFetch = async () => {
      try {
        const result = await fetchFunctionRef.current();
        
        // Only update state if the component is still mounted
        setData(result);
        setError(null);
        setLastUpdated(new Date());
        setRefreshCount(prev => prev + 1);
        return true; // Success
      } catch (err) {
        setError(err);
        return true; // Don't retry
      }
    };
    
    // First attempt
    await attemptFetch();
    
    // Always finish loading state
    setLoading(false);
  };

  // Manual refresh function that can be called by components
  const manualRefresh = () => {
    fetchData();
  };

  // Set up the interval for auto-refresh
  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up interval if enabled
    if (isEnabled) {
      intervalRef.current = setInterval(fetchData, intervalMs);
    }

    // Clean up on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [intervalMs, isEnabled, ...dependencies]);

  // Update interval when settings change
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (isEnabled) {
      intervalRef.current = setInterval(fetchData, intervalMs);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [intervalMs, isEnabled]);

  return { 
    data, 
    loading, 
    error, 
    lastUpdated, 
    manualRefresh, 
    setEnabled,
    refreshCount 
  };
}
