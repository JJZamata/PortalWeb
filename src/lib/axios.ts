import axios from 'axios';
import { toast } from '@/hooks/use-toast';

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
    // Manejar múltiples códigos de error de autenticación
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.log('Sesión expirada o inválida. Redirigiendo al login.');
      
      // Limpiar token inválido
      localStorage.removeItem('token');
      
      // Mostrar mensaje al usuario
      if (typeof window !== 'undefined') {
        // Solo mostrar toast si estamos en el navegador
        try {
          toast({
            title: "Sesión Expirada",
            description: "Tu sesión ha expirado. Serás redirigido al login.",
            variant: "destructive",
          });
        } catch (e) {
          console.warn('No se pudo mostrar el toast:', e);
        }
        
        // Redirigir después de un breve delay para que el usuario vea el mensaje
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;