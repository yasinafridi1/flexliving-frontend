import { getDashboardData } from '@redux/actions/dashboard';
import { createSlice } from '@reduxjs/toolkit';
import asyncThunkRequest from '@utils/asyncThunkRequest';

export const fetchCardsData = asyncThunkRequest('dashboard/cardsFetch', getDashboardData);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    cardLoading: false,
    cardData: {
      totalReviews: 0,
      approvedReviews: 0,
      notApprovedReviews: 0,
      statusCount: [],
      channelsChart: [],
      ratingsChart: []
    }
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCardsData.pending, state => {
        state.cardLoading = true;
      })
      .addCase(fetchCardsData.fulfilled, (state, { payload }) => {
        state.cardLoading = false;
        state.cardData = payload.result;
      })
      .addCase(fetchCardsData.rejected, state => {
        state.cardLoading = false;
      });
  }
});

export default dashboardSlice.reducer;
