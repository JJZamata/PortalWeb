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
  // Inicializar con los datos del localStorage que se guardan en Login
  const initialUser: CurrentUser | null = (() => {
    const token = localStorage.getItem('token');
    if (!token) return null;

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

    if (username || email) {
      return {
        id: userId || undefined,
        username: username || undefined,
        email: email || undefined,
        roles: roles,
      };
    }
    return null;
  })();

  const [user, setUser] = useState<CurrentUser | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Si ya tenemos datos en localStorage, usar esos
        const storedUsername = localStorage.getItem('username');
        const storedEmail = localStorage.getItem('userEmail');
        const storedUserId = localStorage.getItem('userId');
        const storedRolesString = localStorage.getItem('userRoles');

        let storedRoles: string[] | undefined = undefined;
        if (storedRolesString) {
          try {
            storedRoles = JSON.parse(storedRolesString);
          } catch (e) {
            console.error('Error parsing stored roles:', e);
          }
        }

        if (storedUsername || storedEmail) {
          const currentUser: CurrentUser = {
            id: storedUserId || undefined,
            username: storedUsername || undefined,
            email: storedEmail || undefined,
            roles: storedRoles,
          };
          setUser(currentUser);
          setLoading(false);
          return;
        }

        // Si no hay datos en localStorage, intentar obtener del API
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
          console.warn('Error al obtener datos del API /users/me, usando localStorage:', apiError.message);
          // Fallback ya realizado arriba
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
