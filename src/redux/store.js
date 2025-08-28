// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from '@redux/slice/authSlice';
import reviewSlice from '@redux/slice/reviewSlice';
import { attachStore } from '@utils/axiosInstance';

const store = configureStore({
  reducer: {
    auth: authSlice,
    reviews: reviewSlice
  }
});

attachStore(store);
export default store;
