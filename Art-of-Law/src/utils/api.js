// src/utils/api.js
export const getAuthToken = () => localStorage.getItem('token');

export const fetchApi = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const backendUrl = 'http://localhost:5000'; // Your backend URL
  const defaultHeaders = { 'Content-Type': 'application/json' };
  if (token) defaultHeaders['Authorization'] = `Bearer ${token}`;

  const config = { ...options, headers: { ...defaultHeaders, ...options.headers } };

  try {
    const response = await fetch(`${backendUrl}${endpoint}`, config);
    const data = await response.json().catch(() => { // Try to parse JSON in all cases
      if (!response.ok) return { status: 'error', message: response.statusText || `HTTP error ${response.status}` };
      return null; // For OK responses that might be empty (e.g. 204)
    });
    if (!response.ok) throw new Error(data?.message || `HTTP error! Status: ${response.status}`);
    return data;
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    throw error; // Re-throw to be caught by the calling component
  }
};