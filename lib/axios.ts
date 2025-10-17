import axios from 'axios';

export const adminApiClient = axios.create({
  baseURL: '/api/admin',
});

adminApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

adminApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      'Admin API Client Error: ',
      error.response.data || error.message
    );
    return Promise.reject(error);
  }
);
