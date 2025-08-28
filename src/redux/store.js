// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from '@redux/slice/authSlice';
import reviewSlice from '@redux/slice/reviewSlice';
import dashboardSlice from '@redux/slice/dashboardSlice';
import { attachStore } from '@utils/axiosInstance';

const store = configureStore({
  reducer: {
    auth: authSlice,
    reviews: reviewSlice,
    dashboard: dashboardSlice
  }
});

attachStore(store);
export default store;
