import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import tourReducer from '../features/tours/tourSlice';
import subscriptionReducer from '../features/subscriptions/subscriptionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tours: tourReducer,
    subscriptions: subscriptionReducer,
  },
});
