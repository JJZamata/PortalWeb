import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://backendfiscamoto.onrender.com/api',
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired, redirect to login page
      console.log('Sesión expirada o inválida. Redirigiendo al login.');
      window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 