"use client"

import { useEffect, useRef, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../store"
import { fetchTours } from "../features/tours/tourSlice"
import { fetchRequests } from "@/features/requests/requestsSlice"
import { fetchSubscriptions } from "../features/subscriptions/subscriptionSlice"
import { getOperators } from "../features/users/userSlice"

// Global state to track ongoing requests and prevent duplicates
const globalRequestState = {
  tours: { loading: false, loaded: false },
  operators: { loading: false, loaded: false },
  requests: { loading: false, loaded: false },
  subscriptions: { loading: false, loaded: false },
}

// Custom hook to manage app-wide data initialization and caching
export const useAppData = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  // Track if this hook has already initialized data for this user session
  const initializationRef = useRef<string | null>(null)

  const loadTours = useCallback(async () => {
    if (globalRequestState.tours.loading || globalRequestState.tours.loaded) {
      return
    }

    try {
      globalRequestState.tours.loading = true
      await dispatch(fetchTours()).unwrap()
      globalRequestState.tours.loaded = true
    } catch (error) {
      console.error("Failed to load tours:", error)
    } finally {
      globalRequestState.tours.loading = false
    }
  }, [dispatch])

  const loadOperators = useCallback(async () => {
    if (globalRequestState.operators.loading || globalRequestState.operators.loaded) {
      return
    }

    try {
      globalRequestState.operators.loading = true
      await dispatch(getOperators()).unwrap()
      globalRequestState.operators.loaded = true
    } catch (error) {
      console.error("Failed to load operators:", error)
    } finally {
      globalRequestState.operators.loading = false
    }
  }, [dispatch])

  const loadSubscriptions = useCallback(async () => {
    if (globalRequestState.subscriptions.loading || globalRequestState.subscriptions.loaded) {
      return
    }

    try {
      globalRequestState.subscriptions.loading = true
      await dispatch(fetchSubscriptions()).unwrap()
      globalRequestState.subscriptions.loaded = true
    } catch (error) {
      console.error("Failed to load subscriptions:", error)
    } finally {
      globalRequestState.subscriptions.loading = false
    }
  }, [dispatch])

  const loadRequests = useCallback(async () => {
    if (globalRequestState.requests.loading || globalRequestState.requests.loaded) {
      return
    }

    try {
      globalRequestState.requests.loading = true
      await dispatch(fetchRequests()).unwrap()
      globalRequestState.requests.loaded = true
    } catch (error) {
      console.error("Failed to load requests:", error)
    } finally {
      globalRequestState.requests.loading = false
    }
  }, [dispatch])

  // Initialize data based on user role and authentication status
  useEffect(() => {
    if (!isAuthenticated || !user) {
      // Reset global state when user logs out
      Object.keys(globalRequestState).forEach((key) => {
        globalRequestState[key as keyof typeof globalRequestState] = { loading: false, loaded: false }
      })
      initializationRef.current = null
      return
    }

    // Create a unique key for this user session to prevent re-initialization
    const userSessionKey = `${user._id}-${user.role}`

    // If we've already initialized for this user session, don't do it again
    if (initializationRef.current === userSessionKey) {
      return
    }

    const initializeData = async () => {
      try {
        // Always load tours (needed by both roles)
        await loadTours()

        // Load role-specific data
        if (user.role === "agent") {
          // Agents need operators, subscriptions, and requests
          await Promise.all([loadOperators(), loadSubscriptions(), loadRequests()])
        }
        // Operators don't need any additional data on initial load
        // Requests will be loaded lazily when they access the requests tab

        initializationRef.current = userSessionKey
      } catch (error) {
        console.error("Failed to initialize app data:", error)
      }
    }

    initializeData()
  }, [isAuthenticated, user?._id, loadTours, loadOperators, loadSubscriptions, loadRequests, user?.role])

  // Function to refresh specific data (force reload)
  const refreshData = {
    tours: useCallback(async () => {
      globalRequestState.tours.loaded = false
      await loadTours()
    }, [loadTours]),

    operators: useCallback(async () => {
      globalRequestState.operators.loaded = false
      await loadOperators()
    }, [loadOperators]),

    requests: useCallback(async () => {
      globalRequestState.requests.loaded = false
      await loadRequests()
    }, [loadRequests]),

    subscriptions: useCallback(async () => {
      globalRequestState.subscriptions.loaded = false
      await loadSubscriptions()
    }, [loadSubscriptions]),
  }

  return {
    isDataLoaded: {
      tours: globalRequestState.tours.loaded,
      operators: globalRequestState.operators.loaded,
      requests: globalRequestState.requests.loaded,
      subscriptions: globalRequestState.subscriptions.loaded,
    },
    refreshData,
    loadRequests, // Export for lazy loading
  }
}
