import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchOperators } from "../../api/userService"
import type { User } from "../../types"

interface UserState {
  operators: User[]
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  operators: [],
  loading: false,
  error: null,
}

export const getOperators = createAsyncThunk<User[], void>("users/getOperators", async () => {
  const response = await fetchOperators()
  return response.data as User[]
})

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearOperators: (state) => {
      state.operators = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOperators.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getOperators.fulfilled, (state, action) => {
        state.loading = false
        state.operators = action.payload
      })
      .addCase(getOperators.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch operators"
      })
  },
})

export const { clearOperators } = userSlice.actions
export default userSlice.reducer
