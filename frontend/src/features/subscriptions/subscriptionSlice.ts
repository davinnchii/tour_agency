import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { getSubscriptions, createSubscription, deleteSubscription } from "../../api/subscriptionService"
import type { Subscription, CreateSubscriptionPayload } from "../../types"

interface SubscriptionState {
  subscriptions: Subscription[]
  loading: boolean
  error: string | null
}

const initialState: SubscriptionState = {
  subscriptions: [],
  loading: false,
  error: null,
}

export const fetchSubscriptions = createAsyncThunk<Subscription[], void>(
  "subscriptions/fetchSubscriptions",
  async () => {
    const response = await getSubscriptions()
    return response.data as Subscription[]
  },
)

export const addSubscription = createAsyncThunk<Subscription, CreateSubscriptionPayload>(
  "subscriptions/addSubscription",
  async (subscriptionData: CreateSubscriptionPayload) => {
    const response = await createSubscription(subscriptionData)
    return response.data as Subscription
  },
)

export const removeSubscription = createAsyncThunk<string, string>(
  "subscriptions/removeSubscription",
  async (subscriptionId: string) => {
    await deleteSubscription(subscriptionId)
    return subscriptionId
  },
)

const subscriptionSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    setSubscriptions: (state, action: PayloadAction<Subscription[]>) => {
      state.subscriptions = action.payload
    },
    clearSubscriptions: (state) => {
      state.subscriptions = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false
        state.subscriptions = action.payload
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch subscriptions"
      })
      .addCase(addSubscription.fulfilled, (state, action) => {
        state.subscriptions.push(action.payload)
      })
      .addCase(removeSubscription.fulfilled, (state, action) => {
        state.subscriptions = state.subscriptions.filter((sub) => sub._id !== action.payload)
      })
  },
})

export const { setSubscriptions, clearSubscriptions } = subscriptionSlice.actions
export default subscriptionSlice.reducer
