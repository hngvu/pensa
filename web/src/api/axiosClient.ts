import axios from 'axios';

// Create a generic axios instance
export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup interceptor to inject the token dynamically
export const setupAxiosInterceptors = (getToken: () => Promise<string | null>) => {
  // Clear any existing request interceptors to prevent duplication
  axiosClient.interceptors.request.clear();

  axiosClient.interceptors.request.use(
    async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Failed to get Clerk JWT token', error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};
