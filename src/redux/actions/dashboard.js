import api from '@utils/axiosInstance';

export const getDashboardSummary = () => api.get('/dashboard/summary');
export const getDashboardTablesData = () => api.get('/dashboard/chart');
