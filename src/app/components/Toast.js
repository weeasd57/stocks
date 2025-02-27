'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo, FiWifiOff } from 'react-icons/fi';

/**
 * Toast notification component for displaying temporary messages
 * @param {Object} props - Component props
 * @param {string} props.message - Message to display
 * @param {string} props.type - Type of toast (info, success, error, warning, offline)
 * @param {number} props.duration - Duration in milliseconds
 * @param {Function} props.onClose - Callback when toast is closed
 * @returns {JSX.Element} Toast component
 */
export default function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose
}) {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Handle close
  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300); // Wait for animation to complete
  }, [onClose]);

  // Auto-close after duration
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [handleClose]);

  // Handle mounting
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="w-5 h-5" />;
      case 'error':
        return <FiAlertCircle className="w-5 h-5" />;
      case 'warning':
        return <FiAlertCircle className="w-5 h-5" />;
      case 'offline':
        return <FiWifiOff className="w-5 h-5" />;
      case 'info':
      default:
        return <FiInfo className="w-5 h-5" />;
    }
  };

  // Get color classes based on type
  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800';
      case 'offline':
        return 'bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800';
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800';
    }
  };

  // Only render on client
  if (!mounted) return null;

  // Use portal to render at the top level
  return createPortal(
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <div className={`flex items-center p-4 rounded-lg shadow-lg border ${getColorClasses()}`}>
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        <div className="flex-1 mr-2">
          {message}
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </div>,
    document.body
  );
}

/**
 * Toast container component for managing multiple toasts
 * @returns {JSX.Element} Toast container component
 */
export function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  const [mounted, setMounted] = useState(false);

  // Handle mounting
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Add a new toast
  const addToast = useCallback((toast) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  }, []);

  // Remove a toast by ID
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Clear all toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Expose methods via window for global access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.toast = {
        add: addToast,
        remove: removeToast,
        clear: clearToasts,
        info: (message, duration) => addToast({ message, type: 'info', duration }),
        success: (message, duration) => addToast({ message, type: 'success', duration }),
        error: (message, duration) => addToast({ message, type: 'error', duration }),
        warning: (message, duration) => addToast({ message, type: 'warning', duration }),
        offline: (message, duration) => addToast({ message, type: 'offline', duration })
      };
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete window.toast;
      }
    };
  }, [addToast, removeToast, clearToasts]);

  // Only render on client
  if (!mounted) return null;

  // Render all toasts
  return createPortal(
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>,
    document.body
  );
}
