'use client';

import { useState, useEffect, useCallback } from 'react';
import { isOnline } from '../utils/apiUtils';

/**
 * Hook for detecting offline status and providing appropriate feedback
 * @param {Object} options - Configuration options
 * @param {boolean} options.showToast - Whether to show toast notifications on status change
 * @param {Function} options.onOffline - Callback when going offline
 * @param {Function} options.onOnline - Callback when coming back online
 * @returns {Object} Offline detection state and utilities
 */
export default function useOfflineDetection({
  showToast = true,
  onOffline = null,
  onOnline = null
} = {}) {
  const [offline, setOffline] = useState(!isOnline());
  const [wasOffline, setWasOffline] = useState(false);

  // Handle online status change
  const handleOnline = useCallback(() => {
    setOffline(false);
    setWasOffline(true);
    if (onOnline) onOnline();
  }, [onOnline]);

  // Handle offline status change
  const handleOffline = useCallback(() => {
    setOffline(true);
    if (onOffline) onOffline();
  }, [onOffline]);

  // Set up event listeners for online/offline events
  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial status
    setOffline(!isOnline());

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  // Reset wasOffline status after a delay
  useEffect(() => {
    let timeoutId;
    if (wasOffline && !offline) {
      timeoutId = setTimeout(() => {
        setWasOffline(false);
      }, 5000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [wasOffline, offline]);

  // Function to manually check online status
  const checkConnection = useCallback(() => {
    const online = isOnline();
    setOffline(!online);
    return online;
  }, []);

  return {
    isOffline: offline,
    wasOffline,
    checkConnection,
    resetWasOffline: () => setWasOffline(false)
  };
}
