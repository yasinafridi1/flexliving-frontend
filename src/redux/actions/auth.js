import api from '@utils/axiosInstance';

export const login = data => api.post('/auth/login', data);
export const logout = () => api.get('/auth/logout');
