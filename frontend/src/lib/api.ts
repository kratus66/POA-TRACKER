import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enviar cookies
});

// Interceptor para agregar token JWT en cada petición
axiosInstance.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si es 401, limpiar token y redirigir al login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  get: async (url: string) => {
    const response = await axiosInstance.get(url);
    return response.data;
  },

  post: async (url: string, data: any) => {
    const response = await axiosInstance.post(url, data);
    return response.data;
  },

  put: async (url: string, data: any) => {
    const response = await axiosInstance.put(url, data);
    return response.data;
  },

  patch: async (url: string, data: any) => {
    const response = await axiosInstance.patch(url, data);
    return response.data;
  },

  delete: async (url: string) => {
    const response = await axiosInstance.delete(url);
    return response.data;
  },
};

export default axiosInstance;
