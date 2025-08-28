import api from '@utils/axiosInstance';

export const getDashboardData = () => api.get('/dashboard');
