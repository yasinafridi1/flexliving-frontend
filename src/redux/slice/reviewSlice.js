import { getAllReviews, updateStatus } from '@redux/actions/review';
import { createSlice } from '@reduxjs/toolkit';
import asyncThunkRequest from '@utils/asyncThunkRequest';

export const fetchAllReview = asyncThunkRequest('review/fetchall', getAllReviews);
export const editReviewApproval = asyncThunkRequest('review/update', id => updateStatus(id));

const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    isLoading: false,
    data: [],
    totalRows: 0,
    page: 1,
    perPage: 5,
    totalPages: 0,
    selectedItem: null
  },
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setPerPage(state, action) {
      state.perPage = action.payload;
    },
    setSelectedItem(state, { payload }) {
      state.selectedItem = payload;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAllReview.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchAllReview.fulfilled, (state, { payload }) => {
        const { reviewData, pagination } = payload;
        state.isLoading = false;
        state.data = reviewData;
        state.perPage = pagination.limit;
        state.page = pagination.page;
        state.totalRows = pagination.totalRecords;
        state.totalPages = pagination.totalPages;
      })
      .addCase(fetchAllReview.rejected, state => {
        state.isLoading = true;
      })
      .addCase(editReviewApproval.fulfilled, (state, { payload }) => {
        const data = payload.reviewData;
        const index = state.data.findIndex(review => review._id === data._id);
        if (index !== -1) {
          state.data[index] = data;
        }
        state.selectedItem = null;
      });
  }
});

export const { setPage, setPerPage, setSelectedItem } = reviewSlice.actions;
export default reviewSlice.reducer;
