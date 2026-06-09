import axios from 'axios';

// Create the Axios instance
const apiClient = axios.create({
  // This looks for a Vite environment variable, and falls back to port 3000
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach the token to outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    // Grab the token we saved during login
    const token = localStorage.getItem('token');
    
    // If it exists, attach it as a Bearer token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle expired tokens globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the backend kicks back a 401 (Unauthorized), the token is likely invalid/expired
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Force reload to the login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;