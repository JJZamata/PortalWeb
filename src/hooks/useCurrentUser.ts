import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';

interface CurrentUser {
  id?: number | string;
  username?: string;
  email?: string;
  roles?: string[];
  platform?: string;
}

export const useCurrentUser = () => {
  // Start with whatever is in localStorage to avoid showing placeholders while cargando
  const initialUser: CurrentUser | null = (() => {
    const username = localStorage.getItem('username') || undefined;
    const email = localStorage.getItem('userEmail') || undefined;
    if (username || email) return { username, email };
    return null;
  })();

  const [user, setUser] = useState<CurrentUser | null>(initialUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        try {
          // Nuevo endpoint provisto: obtener al usuario autenticado
          const response = await axiosInstance.get('/users/me');
          const apiUser = response.data?.data ?? response.data;

          if (apiUser) {
            const normalizedUser: CurrentUser = {
              id: apiUser.id,
              username: apiUser.username || apiUser.name,
              email: apiUser.email,
              roles: apiUser.roles || (apiUser.role ? [apiUser.role] : undefined),
              platform: apiUser.platform,
            };

            setUser(normalizedUser);

            if (normalizedUser.username) {
              localStorage.setItem('username', normalizedUser.username);
            }
            if (normalizedUser.email) {
              localStorage.setItem('userEmail', normalizedUser.email);
            }

            setLoading(false);
            return;
          }
        } catch (refreshError: any) {
        }        // Fallback: Obtener datos del localStorage
        const userEmail = localStorage.getItem('userEmail');
        const username = localStorage.getItem('username');

        if (username || userEmail) {
          const fallbackUser: CurrentUser = {
            username: username || 'Usuario',
            email: userEmail || undefined
          };
          setUser(fallbackUser);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return { user, loading };
};
