"use client"

import { useCallback } from "react"
import { useAppDispatch } from "../store"
import { fetchRequests } from "@/features/requests/requestsSlice"

// Global state to track lazy loading requests
const lazyRequestState = {
  requests: { loading: false, loaded: false },
}

// Hook for lazy loading data that's only needed when accessed
export const useLazyData = () => {
  const dispatch = useAppDispatch()

  const loadRequests = useCallback(async () => {
    if (lazyRequestState.requests.loading || lazyRequestState.requests.loaded) {
      return
    }

    try {
      lazyRequestState.requests.loading = true
      await dispatch(fetchRequests()).unwrap()
      lazyRequestState.requests.loaded = true
    } catch (error) {
      console.error("Failed to lazy load requests:", error)
    } finally {
      lazyRequestState.requests.loading = false
    }
  }, [dispatch])

  return {
    loadRequests,
    isLoading: lazyRequestState.requests.loading,
  }
}
