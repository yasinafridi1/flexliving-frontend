import api from '@utils/axiosInstance';

export const addLoad = data =>
  api.post('/load', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const getAllLoads = params => {
  const query = new URLSearchParams();
  if (params) {
    if (Array.isArray(params.truck)) {
      params.truck.forEach(truck => {
        query.append('truck', truck);
      });
    }
    if (params.page) {
      query.append('page', params.page);
    }
    if (params.startDate) {
      query.append('startDate', params.startDate);
    }
    if (params.endDate) {
      query.append('endDate', params.endDate);
    }

    if (params.perPage) {
      query.append('perPage', params.perPage);
    }

    if (params.from) {
      query.append('from', params.from);
    }
    if (params.to) {
      query.append('to', params.to);
    }

    return api.get(`/load?${query.toString()}`);
  } else {
    return api.get(`/load`);
  }
};
export const getLoadDetail = id => api.get(`/load/${id}`);
export const updateLoad = (id, data) =>
  api.patch(`/load/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const deleteLoad = id => api.delete(`/load/${id}`);
