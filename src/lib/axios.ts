import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Keys for localStorage
export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

// Type for the refresh response
interface RefreshResponse {
  data: {
    access_token: string;
    refresh_token: string;
  };
}

// Callback for session expiry
type SessionExpiredCallback = () => void;
let onSessionExpired: SessionExpiredCallback | null = null;

export const registerSessionExpiredCallback = (
  callback: SessionExpiredCallback
) => {
  onSessionExpired = callback;
};

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem(ACCESS_TOKEN_KEY)
        : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
// Flag to debounce session expired alerts
let isSessionExpiredTriggered = false;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 1. Excluir Login: Si falla el login, no intentar refrescar
    if (originalRequest.url?.includes('/auth/login')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken =
        typeof window !== 'undefined'
          ? localStorage.getItem(REFRESH_TOKEN_KEY)
          : null;

      if (!refreshToken) {
        isRefreshing = false;
        // Debounce de Expiración
        if (!isSessionExpiredTriggered) {
          isSessionExpiredTriggered = true;
          if (onSessionExpired) onSessionExpired();
        }
        return Promise.reject(error);
      }

      try {
        const response = await axios.post<RefreshResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken }
        );

        const { access_token, refresh_token } = response.data.data;

        localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);

        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }

        processQueue(null, access_token);
        isRefreshing = false;
        // Reset flag on success (optional but good practice if SPA doesn't reload)
        isSessionExpiredTriggered = false;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        // Token refresh failed - Session expired
        // Debounce de Expiración
        if (!isSessionExpiredTriggered) {
          isSessionExpiredTriggered = true;
          if (onSessionExpired) onSessionExpired();
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
