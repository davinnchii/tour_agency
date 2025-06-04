import { combineReducers } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import requestsReducer from "@/features/requests/requestsSlice"
import subscriptionReducer from "../features/subscriptions/subscriptionSlice"
import tourReducer from "../features/tours/tourSlice"
import userReducer from "../features/users/userSlice"

const rootReducer = combineReducers({
  auth: authReducer,
  requests: requestsReducer,
  subscriptions: subscriptionReducer,
  tours: tourReducer,
  users: userReducer, // Note: changed from 'operators' to 'users' to match your slice name
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
