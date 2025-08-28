import api from '@utils/axiosInstance';

export const getAllReviews = params => {
  const query = new URLSearchParams();
  if (params) {
    if (params.page) {
      query.append('page', params.page);
    }
    if (params.perPage) {
      query.append('limit', params.perPage);
    }
    if (params.search) {
      query.append('search', params.search);
    }

    if (params.minRating) {
      query.append('minRating', params.minRating);
    }

    if (params.maxRating) {
      query.append('maxRating', params.maxRating);
    }

    if (params.approved) {
      query.append('approved', params.approved);
    }

    if (Array.isArray(params.channels)) {
      params.channels.forEach(channel => {
        query.append('channel', channel);
      });
    }

    return api.get(`/reviews?${query.toString()}`);
  }
};

export const updateStatus = id => api.patch(`/reviews/${id}`);
