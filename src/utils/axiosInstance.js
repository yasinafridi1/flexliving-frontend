import axios from 'axios';
import { getLocalStorageValue, removeTokens, storeTokens } from '@utils/localstorageutil';
import CONSTANTS from '@data/Constants';
import { forceLogout } from '@redux/slice/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

export const checkSession = async () => {
  try {
    const refresh = getLocalStorageValue(CONSTANTS.REFRESH_TOKEN);
    if (!refresh) {
      return Promise.reject(new Error('No refresh token'));
    }
    const response = await api.post('/auth/auto_login', { refreshToken: refresh });
    return response.data;
  } catch (error) {
    removeTokens();
    throw error;
  }
};

export const attachStore = store => {
  /** ───── Request ───── */
  api.interceptors.request.use(config => {
    const token = getLocalStorageValue(CONSTANTS.ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  /** ───── Response ───── */
  api.interceptors.response.use(
    response => response,
    async error => {
      const original = error.config;
      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;

        const refresh = getLocalStorageValue(CONSTANTS.REFRESH_TOKEN);
        if (!refresh) {
          store.dispatch(forceLogout());
          return Promise.reject(new Error('No refresh token'));
        }

        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/auto_login`,
            {
              refreshToken: refresh
            },
            {
              withCredentials: true
            }
          );
          storeTokens(data);
          return api(original); // retry original request
        } catch {
          removeTokens();
          store.dispatch(forceLogout());
        }
      }
      return Promise.reject(error);
    }
  );
};

export default api;
