import api from '@utils/axiosInstance';

export const login = data => api.post('/auth/login', data);
export const logout = () => api.get('/auth/logout');
export const createUpdateHostawayKeys = data => api.post('/hostaway', data);
export const connectHostaway = () => api.patch('/hostaway');
