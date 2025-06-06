import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "./rootReducer"
import type { PopulatedRequest, PopulatedSubscription } from "../types"

// Memoized selectors to prevent unnecessary re-renders
export const selectAuth = (state: RootState) => state.auth
export const selectTours = (state: RootState) => state.tours
export const selectRequests = (state: RootState) => state.requests
export const selectSubscriptions = (state: RootState) => state.subscriptions
export const selectUsers = (state: RootState) => state.users

// Memoized selector for user requests
export const selectUserRequests = createSelector([selectRequests, selectAuth], (requestsState, authState) => {
  if (!authState.user || authState.user.role !== "agent") return []

  // Filter requests by the current user
  return requestsState.requests.filter((request) => {
    // Handle both string and object references for createdBy
    const createdById =
      typeof request.createdBy === "string" ? request.createdBy : request.createdBy?._id || request.createdBy?._id
    return createdById === authState.user!._id
  })
})

// Memoized selector for operator requests
export const selectOperatorRequests = createSelector([selectRequests, selectAuth], (requestsState, authState) => {
  if (!authState.user || authState.user.role !== "operator") return []
  return requestsState.requests.filter((req) => {
    const populatedReq = req as PopulatedRequest
    return populatedReq.tour?.operator?._id === authState.user!._id
  })
})

// Memoized selector for user subscriptions
export const selectUserSubscriptions = createSelector(
  [selectSubscriptions, selectAuth],
  (subscriptionsState, authState) => {
    if (!authState.user || authState.user.role !== "agent") return []
    return subscriptionsState.subscriptions.filter((sub) => {
      const populatedSub = sub as PopulatedSubscription
      return populatedSub.agency?._id === authState.user!._id
    })
  },
)

// Memoized selector for subscription status by operator
export const selectSubscriptionByOperator = createSelector(
  [selectUserSubscriptions, (state: RootState, operatorId: string) => operatorId],
  (userSubscriptions, operatorId) => {
    return userSubscriptions.find((sub) => {
      const populatedSub = sub as PopulatedSubscription
      return populatedSub.operator?._id === operatorId
    })
  },
)

// Memoized selector for tours with search results
export const selectDisplayTours = createSelector([selectTours], (toursState) => {
  return toursState.searchResults.length > 0 ? toursState.searchResults : toursState.tours
})

// Memoized selector for loading states
export const selectLoadingStates = createSelector(
  [selectAuth, selectTours, selectRequests, selectSubscriptions, selectUsers],
  (auth, tours, requests, subscriptions, users) => ({
    auth: auth.loading,
    tours: tours.loading,
    requests: requests.loading,
    subscriptions: subscriptions.loading,
    users: users.loading,
    anyLoading: auth.loading || tours.loading || requests.loading || subscriptions.loading || users.loading,
  }),
)
