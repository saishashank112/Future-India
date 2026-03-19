/**
 * API Configuration
 * 
 * To override the default development URL, create a .env.local file in the client directory
 * and add: VITE_API_BASE_URL=https://your-production-url.com
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

// Helper to construct API endpoints
export const getApiUrl = (endpoint: string) => {
  // Ensure endpoint starts with /
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}/api${path}`;
};
