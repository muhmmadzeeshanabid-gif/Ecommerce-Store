/**
 * Centralized API utility for the Boutique Fashion Store.
 * Handles automatic switching between local and production backend URLs.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backened-production-9da0.up.railway.app';

export const fetchApi = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Authorization': 'Bearer mock-token-123',
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    next: { revalidate: 60, ...options.next }, // Cache for 60 seconds by default
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};
