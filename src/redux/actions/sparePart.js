import api from '@utils/axiosInstance';

export const addSparePart = data =>
  api.post('/spare_part', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const getAllSpareParts = params => {
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
    return api.get(`/spare_part?${query.toString()}`);
  } else {
    return api.get(`/spare_part`);
  }
};
export const getSparePartDetail = id => api.get(`/spare_part/${id}`);
export const updateSparePart = (id, data) =>
  api.patch(`/spare_part/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const deleteSparePart = id => api.delete(`/spare_part/${id}`);
export const getSparePartOptions = () => api.get('/spare_part/spare_parts_options');
