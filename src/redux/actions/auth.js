import api from '@utils/axiosInstance';

export const login = data => api.post('/auth/login', data);
export const updateUser = data =>
  api.patch('/auth', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
export const logout = () => api.get('/auth/logout');
export const createUpdateHostawayKeys = data => api.post('/hostaway', data);
export const connectHostaway = () => api.patch('/hostaway');
export const disconnectHostaway = () => api.delete('/hostaway');
