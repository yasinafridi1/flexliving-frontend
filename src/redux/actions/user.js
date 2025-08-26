import api from '@utils/axiosInstance';

export const addUser = data => api.post('/user/', data);
export const getUsers = params => {
  const query = new URLSearchParams();
  if (params) {
    if (params.search) {
      query.append('search', params.search);
    }

    if (params.page) {
      query.append('page', params.page);
    }

    if (params.perPage) {
      query.append('perPage', params.perPage);
    }
    if (Array.isArray(params.status)) {
      params.status.forEach(status => {
        query.append('status', status); // 👈 repeated key: status=ACTIVE&status=BLOCKED
      });
    }
    return api.get(`/user?${query.toString()}`);
  } else {
    return api.get(`/user`);
  }
};
export const getUserDetail = id => api.get(`/user/${id}`);
export const updateUser = (id, data) => api.patch(`/user/${id}`, data);
export const deleteUser = id => api.delete(`/user/${id}`);
