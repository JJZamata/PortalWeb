import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://backendfiscamoto.onrender.com/api',
  withCredentials: true,
});

// Interceptor para agregar el token automáticamente a todas las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired, redirect to login page
      console.log('Sesión expirada o inválida. Redirigiendo al login.');
      localStorage.removeItem('token'); // Limpiar token inválido
      window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 