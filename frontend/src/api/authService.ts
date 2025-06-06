import axios from "axios"
import type { LoginPayload, RegisterPayload } from "../types"
import api from "@/utils/api"

// Backend response format
interface BackendAuthResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: "agent" | "operator"
    subscriptions: string[]
  }
}

export const login = async (email: string, password: string): Promise<LoginPayload> => {
  const res = await api.post<BackendAuthResponse>(`/api/auth/login`, {
    email,
    password,
  })

  return {
    token: res.data.token,
    user: {
      _id: res.data.user.id,
      name: res.data.user.name,
      email: res.data.user.email,
      role: res.data.user.role,
      subscriptions: res.data.user.subscriptions,
    },
  }
}

export const register = async (userData: RegisterPayload): Promise<LoginPayload> => {
  const res = await api.post<BackendAuthResponse>(`/api/auth/register`, userData)

  // Transform backend response to match frontend types
  return {
    token: res.data.token,
    user: {
      _id: res.data.user.id,
      name: res.data.user.name,
      email: res.data.user.email,
      role: res.data.user.role,
      subscriptions: res.data.user.subscriptions,
    },
  }
}

export const logout = async (): Promise<void> => {
  // Clear local storage - no backend call needed based on your controller
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}
