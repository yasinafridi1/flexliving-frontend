import api from '@utils/axiosInstance';

export const addUsePart = data => api.post('/use_part', data);
export const getAllUseParts = params => {
  const query = new URLSearchParams();
  if (params) {
    if (Array.isArray(params.truck)) {
      params.truck.forEach(truck => {
        query.append('truck', truck);
      });
    }

    if (Array.isArray(params.sparepart)) {
      params.sparepart.forEach(sparepart => {
        query.append('spare_part', sparepart);
      });
    }
    if (params.page) {
      query.append('page', params.page);
    }

    if (params.perPage) {
      query.append('perPage', params.perPage);
    }
    return api.get(`/use_part?${query.toString()}`);
  } else {
    return api.get(`/use_part`);
  }
};
export const getUsePartDetail = id => api.get(`/use_part/${id}`);
export const updateUsePart = (id, data) => api.patch(`/use_part/${id}`, data);
export const deleteUsePart = id => api.delete(`/use_part/${id}`);
