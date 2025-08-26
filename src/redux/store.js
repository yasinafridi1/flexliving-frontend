// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from '@redux/slice/authSlice';
import { attachStore } from '@utils/axiosInstance';

const store = configureStore({
  reducer: {
    auth: authSlice
  }
});

attachStore(store);
export default store;
