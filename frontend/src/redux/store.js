import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import urlsReducer from './slices/urlsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    urls: urlsReducer,
  },
});

export default store;
