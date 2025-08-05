import { useEffect, useRef } from 'react';
import axiosInstance from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';

export const useTokenRefresh = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Verificar el token cada 5 minutos
      intervalRef.current = setInterval(async () => {
        try {
          await axiosInstance.get('/auth/verify');
        } catch (error) {
          // Token expirado, el interceptor ya maneja la redirección
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      }, 5 * 60 * 1000); // 5 minutos
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return null;
};
