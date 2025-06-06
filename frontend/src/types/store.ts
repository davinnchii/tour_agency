// Additional store-related types
import type { RootState } from "@/store"

// Individual state slice types - these are the types for each slice
export type AuthState = RootState["auth"]
export type RequestsState = RootState["requests"]
export type SubscriptionsState = RootState["subscriptions"]
export type ToursState = RootState["tours"]
export type UsersState = RootState["users"]

// Selector return types for common use cases
export type ToursSelector = ToursState["tours"]
export type RequestsSelector = RequestsState["requests"]
export type SubscriptionsSelector = SubscriptionsState["subscriptions"]
export type UserSelector = AuthState["user"]
export type OperatorsSelector = UsersState["operators"]

// Helper types for specific selectors
export type AuthUserSelector = (state: RootState) => AuthState["user"]
export type AuthTokenSelector = (state: RootState) => AuthState["token"]
export type AuthIsAuthenticatedSelector = (state: RootState) => AuthState["isAuthenticated"]
