import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';

interface CurrentUser {
  id?: number | string;
  username?: string;
  email?: string;
  roles?: string[];
  platform?: string;
}

const getStoredUser = (): CurrentUser | null => {
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('userEmail');
  const userId = localStorage.getItem('userId');
  const rolesString = localStorage.getItem('userRoles');

  let roles: string[] | undefined = undefined;
  if (rolesString) {
    try {
      roles = JSON.parse(rolesString);
    } catch (e) {
      console.error('Error parsing roles:', e);
    }
  }

  if (!username && !email && !userId) return null;

  return {
    id: userId || undefined,
    username: username || undefined,
    email: email || undefined,
    roles,
  };
};

export const useCurrentUser = () => {
  // Inicializar con datos guardados, aunque no exista token Bearer (sesión por cookie)
  const initialUser: CurrentUser | null = getStoredUser();

  const [user, setUser] = useState<CurrentUser | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedUser = getStoredUser();

      if (storedUser) {
        setUser(storedUser);
        setLoading(false);
      } else {
        setLoading(true);
      }

      try {
        // Intentar obtener del API incluso sin token Bearer (puede haber sesión por cookie)
        try {
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

            // Guardar en localStorage para futuras cargas
            if (normalizedUser.id) {
              localStorage.setItem('userId', normalizedUser.id.toString());
            }
            if (normalizedUser.username) {
              localStorage.setItem('username', normalizedUser.username);
            }
            if (normalizedUser.email) {
              localStorage.setItem('userEmail', normalizedUser.email);
            }
            if (normalizedUser.roles && normalizedUser.roles.length > 0) {
              localStorage.setItem('userRoles', JSON.stringify(normalizedUser.roles));
            }
          }
        } catch (apiError: any) {
          if (!storedUser) {
            setUser(null);
          }
          console.warn('Error al obtener datos del API /users/me, usando fallback local:', apiError.message);
        }
      } catch (error) {
        console.error('Error en useCurrentUser:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return { user, loading };
};
