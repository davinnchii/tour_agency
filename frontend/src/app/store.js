import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import tourReducer from '../features/tours/tourSlice';
import subscriptionReducer from '../features/subscriptions/subscriptionSlice';
import requestsReducer from '../features/requests/requestsSlice';
import usersReducer from '../features/users/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tours: tourReducer,
    subscriptions: subscriptionReducer,
    requests: requestsReducer,
    operators: usersReducer,
  },
});
