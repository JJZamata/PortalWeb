import axios from 'axios';
import { toast } from '@/hooks/use-toast';

const axiosInstance = axios.create({
  baseURL: 'https://backfiscamotov2.onrender.com/api',
  withCredentials: true,
});

let refreshPromise: Promise<string | null> | null = null;
let redirectingToLogin = false;

const getTokenFromRefreshResponse = (data: any): string | null => {
  return data?.token || data?.data?.token || null;
};

const refreshAccessToken = async (): Promise<string | null> => {
  const response = await axios.post(
    'https://backfiscamotov2.onrender.com/api/auth/refresh',
    {},
    { withCredentials: true }
  );

  const refreshedToken = getTokenFromRefreshResponse(response?.data);

  if (refreshedToken) {
    localStorage.setItem('token', refreshedToken);
  }

  return refreshedToken;
};

const forceLogoutAndRedirect = () => {
  localStorage.removeItem('token');

  if (redirectingToLogin || typeof window === 'undefined') return;
  redirectingToLogin = true;

  try {
    toast({
      title: 'Sesión Expirada',
      description: 'Tu sesión ha expirado. Serás redirigido al login.',
      variant: 'destructive',
    });
  } catch (e) {
  }

  setTimeout(() => {
    window.location.href = '/';
  }, 1200);
};

// Interceptor para agregar el token automáticamente a todas las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'authenticated') {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers?.Authorization) {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config as (any & { _retry?: boolean; url?: string });

    if (!status || !originalRequest || ![401, 403].includes(status)) {
      return Promise.reject(error);
    }

    const requestUrl = String(originalRequest.url || '');
    const isAuthEndpoint = requestUrl.includes('/auth/signin') || requestUrl.includes('/auth/signout');
    const isRefreshEndpoint = requestUrl.includes('/auth/refresh');

    if (isAuthEndpoint || isRefreshEndpoint || originalRequest._retry) {
      forceLogoutAndRedirect();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise;
      if (newToken) {
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      forceLogoutAndRedirect();
      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;