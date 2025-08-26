import api from '@utils/axiosInstance';

export const addTruck = data =>
  api.post('/truck', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const getAllTruck = params => {
  const query = new URLSearchParams();
  if (params) {
    if (params.page) {
      query.append('page', params.page);
    }

    if (params.perPage) {
      query.append('perPage', params.perPage);
    }
    if (params.search) {
      query.append('search', params.search);
    }
    return api.get(`/truck?${query.toString()}`);
  } else {
    return api.get(`/truck`);
  }
};
export const getTruckDetail = id => api.get(`/truck/${id}`);
export const updateTruck = (id, data) =>
  api.patch(`/truck/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const deleteTruck = id => api.delete(`/truck/${id}`);
export const getTruckOptions = () => api.get('/truck/truck_options');
