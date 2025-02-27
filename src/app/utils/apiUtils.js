/**
 * Utility functions for API calls and error handling
 */

import axios from 'axios';

/**
 * Create an axios instance with default configuration
 * @param {number} timeout - Request timeout in milliseconds
 * @returns {Object} Configured axios instance
 */
export const createApiClient = (timeout = 10000) => {
  return axios.create({
    timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Create an AbortController with timeout
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Object} AbortController and signal
 */
export const createAbortController = (timeoutMs = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  // Return both the controller and a function to clear the timeout
  return {
    controller,
    signal: controller.signal,
    clearTimeout: () => clearTimeout(timeoutId)
  };
};

/**
 * Handle API errors consistently
 * @param {Error} error - Error object from axios
 * @param {string} fallbackMessage - Fallback message if error is not recognized
 * @returns {Object} Formatted error object
 */
export const handleApiError = (error, fallbackMessage = 'An error occurred') => {
  // Check if the request was aborted/canceled
  if (axios.isCancel(error)) {
    return {
      message: 'Request was canceled',
      code: 'CANCELED',
      isTimeout: error.message === 'timeout',
      isOffline: false,
      originalError: error
    };
  }
  
  // Check for network errors
  if (error.message === 'Network Error') {
    return {
      message: 'Network error. Please check your internet connection.',
      code: 'NETWORK_ERROR',
      isTimeout: false,
      isOffline: true,
      originalError: error
    };
  }
  
  // Check for timeout
  if (error.code === 'ECONNABORTED' || (error.message && error.message.includes('timeout'))) {
    return {
      message: 'Request timed out. Please try again.',
      code: 'TIMEOUT',
      isTimeout: true,
      isOffline: false,
      originalError: error
    };
  }
  
  // Handle axios error responses
  if (error.response) {
    const { status, data } = error.response;
    
    // Common HTTP status codes
    switch (status) {
      case 400:
        return {
          message: data.message || 'Bad request',
          code: 'BAD_REQUEST',
          status,
          isTimeout: false,
          isOffline: false,
          originalError: error
        };
      case 401:
        return {
          message: 'Authentication required',
          code: 'UNAUTHORIZED',
          status,
          isTimeout: false,
          isOffline: false,
          originalError: error
        };
      case 403:
        return {
          message: 'Access denied',
          code: 'FORBIDDEN',
          status,
          isTimeout: false,
          isOffline: false,
          originalError: error
        };
      case 404:
        return {
          message: 'Resource not found',
          code: 'NOT_FOUND',
          status,
          isTimeout: false,
          isOffline: false,
          originalError: error
        };
      case 429:
        return {
          message: 'Too many requests. Please try again later.',
          code: 'RATE_LIMITED',
          status,
          isTimeout: false,
          isOffline: false,
          originalError: error
        };
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          message: 'Server error. Please try again later.',
          code: 'SERVER_ERROR',
          status,
          isTimeout: false,
          isOffline: false,
          originalError: error
        };
      default:
        return {
          message: data.message || `Error: ${status}`,
          code: 'API_ERROR',
          status,
          isTimeout: false,
          isOffline: false,
          originalError: error
        };
    }
  }
  
  // Default error
  return {
    message: fallbackMessage,
    code: 'UNKNOWN_ERROR',
    isTimeout: false,
    isOffline: false,
    originalError: error
  };
};

/**
 * Check if the current environment is a browser
 * @returns {boolean} True if running in browser
 */
export const isBrowser = () => {
  return typeof window !== 'undefined';
};

/**
 * Check if the device is online
 * @returns {boolean} True if online, false if offline
 */
export const isOnline = () => {
  return isBrowser() ? navigator.onLine : true;
};

/**
 * Format API response data consistently
 * @param {Object} data - API response data
 * @param {boolean} isMockData - Whether the data is mock data
 * @returns {Object} Formatted response data
 */
export const formatApiResponse = (data, isMockData = false) => {
  return {
    data,
    isMockData,
    timestamp: new Date().toISOString()
  };
};
