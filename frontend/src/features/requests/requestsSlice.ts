import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { createRequest, getRequests, deleteRequest } from "../../api/requestService"
import type { Request, CreateRequestPayload } from "../../types"

interface RequestsState {
  requests: Request[]
  loaded: boolean
  loading: boolean
  error: string | null
}

const initialState: RequestsState = {
  requests: [],
  loaded: false,
  loading: false,
  error: null,
}

export const fetchRequests = createAsyncThunk<Request[], void>("requests/fetchRequests", async () => {
  const response = await getRequests()
  // Handle both nested and direct response formats
  if (response.data?.data) {
    return response.data.data as Request[]
  }
  return response.data as Request[]
})

export const addRequest = createAsyncThunk<Request, CreateRequestPayload>(
  "requests/addRequest",
  async (requestData: CreateRequestPayload) => {
    const response = await createRequest(requestData)
    // Handle both nested and direct response formats
    if (response.data?.data) {
      return response.data.data as Request
    }
    return response.data as Request
  },
)

export const removeRequest = createAsyncThunk<string, string>("requests/removeRequest", async (requestId: string) => {
  await deleteRequest(requestId)
  return requestId
})

const requestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    setRequests: (state, action: PayloadAction<Request[]>) => {
      state.requests = action.payload
    },
    clearRequests: (state) => {
      state.requests = []
      state.loaded = false
    },
    updateRequestStatus: (
      state,
      action: PayloadAction<{ id: string; status: "pending" | "approved" | "rejected" }>,
    ) => {
      const request = state.requests.find((r) => r._id === action.payload.id)
      if (request) {
        request.status = action.payload.status
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false
        state.requests = action.payload
        state.loaded = true
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch requests"
      })
      .addCase(addRequest.fulfilled, (state, action) => {
        state.requests.push(action.payload)
      })
      .addCase(removeRequest.fulfilled, (state, action) => {
        state.requests = state.requests.filter((r) => r._id !== action.payload)
      })
  },
})

export const { clearRequests, setRequests, updateRequestStatus } = requestsSlice.actions
export default requestsSlice.reducer
