import { useEffect, useRef } from 'react';
import axiosInstance from '@/lib/axios';

export const useTokenRefresh = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const hasSessionData = !!localStorage.getItem('username') || !!localStorage.getItem('userId');
    
    if (token || hasSessionData) {
      // Refrescar sesión cada 20 minutos usando endpoint real de refresh
      intervalRef.current = setInterval(async () => {
        try {
          await axiosInstance.post('/auth/refresh');
        } catch (error) {
          // El interceptor de axios maneja reintentos/redirect según corresponda
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      }, 20 * 60 * 1000); // 20 minutos
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return null;
};
