import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { login, register, logout as logoutApi } from "../../api/authService"
import type { LoginPayload, RegisterPayload, LoginCredentials } from "../../types"

// Updated to match backend user structure
interface AuthUser {
  _id: string // Backend uses 'id' not '_id'
  name: string
  email: string
  role: "agent" | "operator"
  subscriptions: string[]
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
}

// Async thunks
export const loginAsync = createAsyncThunk<LoginPayload, LoginCredentials>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials.email, credentials.password)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed")
    }
  },
)

export const registerAsync = createAsyncThunk<LoginPayload, RegisterPayload>(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await register(userData)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Registration failed")
    }
  },
)

export const logoutAsync = createAsyncThunk<void, void>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await logoutApi()
  } catch (error: any) {
    // Even if logout fails on server, we still want to clear local state
    console.warn("Logout API call failed:", error)
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Keep these for manual state updates if needed
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload
      localStorage.setItem("user", JSON.stringify(action.payload))
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
        localStorage.setItem("token", action.payload.token)
        localStorage.setItem("user", JSON.stringify(action.payload.user))
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
        state.token = null
        state.user = null
      })
      // Register
      .addCase(registerAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
        state.isAuthenticated = true
        state.error = null
        localStorage.setItem("token", action.payload.token)
        localStorage.setItem("user", JSON.stringify(action.payload.user))
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
        state.token = null
        state.user = null
      })
      // Logout
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false
        state.token = null
        state.user = null
        state.isAuthenticated = false
        state.error = null
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      })
      .addCase(logoutAsync.rejected, (state) => {
        // Even if logout fails, clear local state
        state.loading = false
        state.token = null
        state.user = null
        state.isAuthenticated = false
        state.error = null
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      })
  },
})

export const { clearError, setUser } = authSlice.actions
export default authSlice.reducer
