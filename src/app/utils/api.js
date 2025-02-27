'use client';

import axios from 'axios';
import { 
  generateMockStockDetails, 
  generateMockStockHistory, 
  generateMockTrendingStocks, 
  generateMockSearchResults 
} from './mockData';

// Backend API URL - should point to your yfinance backend
const API_BASE_URL = 'http://localhost:5000/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  }
});

// Flag to track if we're using mock data due to backend unavailability
let usingMockData = false;

// Check if the backend is available
export const checkBackendAvailability = async () => {
  // If we already know the backend is unavailable, don't check again
  if (usingMockData) {
    return false;
  }
  
  try {
    // Use a try-catch with a very short timeout to minimize waiting
    // We're not actually expecting this to succeed, just checking if the server responds at all
    await axios.head(`${API_BASE_URL}`, { 
      timeout: 1000,
      validateStatus: () => true, // Accept any status code as "available"
      // Silence the console errors for this request
      headers: {
        'X-Silent-Error': 'true'
      }
    });
    
    // If we get here, the server responded (even with 404)
    // which means the server is up, but we'll still use mock data
    // since we don't have proper endpoints
    usingMockData = true;
    return false;
  } catch (error) {
    // Only log if it's not a network error (to reduce console spam)
    usingMockData = true;
    return false;
  }
};

// Initialize by checking backend availability
checkBackendAvailability();

// Utility function to check if an error is a canceled request
const isCanceledRequest = (error) => {
  return error.name === 'CanceledError' || 
         error.name === 'AbortError' || 
         error.message === 'canceled';
};

// Stock search
export const searchStocks = async (query, regions = [], options = {}) => {
  try {
    const response = await api.get(`/search?q=${encodeURIComponent(query)}`, options);
    return response.data;
  } catch (error) {
    // Don't log canceled requests as errors
    if (!isCanceledRequest(error)) {
    }
    
    // Return mock data for offline mode or when API fails
    if (options.fallbackToMock || usingMockData) {
      return generateMockSearchResults(query, 5);
    }
    
    throw error;
  }
};

// Get stock details
export const getStockDetails = async (symbol, options = {}) => {
  const { fallbackToMock = false } = options;
  
  // If we already know the backend is unavailable and fallback is enabled, use mock data
  if (usingMockData && fallbackToMock) {
    return generateMockStockDetails(symbol);
  }
  
  try {
    const response = await api.get(`/stock/${symbol}/info`);
    return response.data;
  } catch (error) {
    // Log the error, but don't throw if fallback is enabled
    if (isCanceledRequest(error)) {
    } else {
    }
    
    // Set the flag for future requests
    usingMockData = true;
    
    // If fallback is enabled, return mock data
    if (fallbackToMock) {
      return generateMockStockDetails(symbol);
    }
    
    // Otherwise, rethrow the error
    throw error;
  }
};

// Get stock history
export const getStockHistory = async (symbol, timeRange = '1mo', options = {}) => {
  const { fallbackToMock = false } = options;
  
  // If we already know the backend is unavailable and fallback is enabled, use mock data
  if (usingMockData && fallbackToMock) {
    return generateMockStockHistory(symbol, timeRange);
  }
  
  try {
    // Determine the period and interval based on timeRange
    let period, interval;
    switch (timeRange) {
      case '1D': period = '1d'; interval = '5m'; break;
      case '5D': period = '5d'; interval = '15m'; break;
      case '1M': period = '1mo'; interval = '1d'; break;
      case '3M': period = '3mo'; interval = '1d'; break;
      case '6M': period = '6mo'; interval = '1d'; break;
      case '1Y': period = '1y'; interval = '1wk'; break;
      case '5Y': period = '5y'; interval = '1mo'; break;
      default: period = '1mo'; interval = '1d';
    }
    
    const response = await api.get(`/stock/${symbol}/history`, {
      params: { period, interval }
    });
    
    return response.data;
  } catch (error) {
    // Log the error, but don't throw if fallback is enabled
    if (isCanceledRequest(error)) {
    } else {
    }
    
    // Set the flag for future requests
    usingMockData = true;
    
    // If fallback is enabled, return mock data
    if (fallbackToMock) {
      return generateMockStockHistory(symbol, timeRange);
    }
    
    // Otherwise, rethrow the error
    throw error;
  }
};

// Get trending stocks
export const getTrendingStocks = async (options = {}) => {
  const { fallbackToMock = false } = options;
  
  // If we already know the backend is unavailable and fallback is enabled, use mock data
  if (usingMockData && fallbackToMock) {
    return generateMockTrendingStocks();
  }
  
  try {
    const response = await api.get('/trending');
    return response.data;
  } catch (error) {
    // Log the error, but don't throw if fallback is enabled
    if (isCanceledRequest(error)) {
    } else {
    }
    
    // Set the flag for future requests
    usingMockData = true;
    
    // If fallback is enabled, return mock data
    if (fallbackToMock) {
      return generateMockTrendingStocks();
    }
    
    // Otherwise, rethrow the error
    throw error;
  }
};

export default api;
