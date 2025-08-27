import { connectHostaway, createUpdateHostawayKeys, login, logout } from '@redux/actions/auth';
import { createSlice } from '@reduxjs/toolkit';
import asyncThunkRequest from '@utils/asyncThunkRequest';

export const signIn = asyncThunkRequest('auth/signin', body => login(body));
export const userLogout = asyncThunkRequest('auth/logout', logout);
export const addUpdateHostAwayKeys = asyncThunkRequest('auth/addUpdateHostAwayKeys', body =>
  createUpdateHostawayKeys(body)
);
export const authenticateHostaway = asyncThunkRequest('auth/hostawayConnect', connectHostaway);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    data: null,
    error: null,
    loading: false
  },
  reducers: {
    forceLogout: state => {
      state.isLoggedIn = false;
      state.data = null;
      state.error = null;
    },
    setUserLogin: (state, { payload }) => {
      state.isLoggedIn = true;
      state.data = payload.userData;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(signIn.fulfilled, (state, { payload }) => {
        state.isLoggedIn = true;
        state.data = payload.userData;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, { payload, error }) => {
        state.loading = false;
        state.error = payload || error?.message || 'Something went wrong';
      })
      .addCase(userLogout.fulfilled, state => {
        state.isLoggedIn = false;
        state.data = null;
      })
      .addCase(addUpdateHostAwayKeys.fulfilled, (state, { payload }) => {
        state.data = payload.userData;
      })
      .addCase(addUpdateHostAwayKeys.rejected, (state, { payload, error }) => {
        state.loading = false;
        state.error = payload || error?.message || 'Something went wrong';
      })
      .addCase(authenticateHostaway.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateHostaway.fulfilled, (state, { payload }) => {
        state.data = payload.userData;
        state.loading = false;
        state.error = null;
      })
      .addCase(authenticateHostaway.rejected, (state, { payload, error }) => {
        state.loading = false;
        state.error = payload || error?.message || 'Something went wrong';
      });
  }
});

export const { forceLogout, setUserLogin } = authSlice.actions;
export default authSlice.reducer;
