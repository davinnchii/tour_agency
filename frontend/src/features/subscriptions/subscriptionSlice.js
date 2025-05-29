// src/features/subscriptions/subscriptionSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getSubscriptions,
  createSubscription,
  deleteSubscription,
} from '../../api/tourService';

export const fetchSubscriptions = createAsyncThunk(
  'subscriptions/fetchSubscriptions',
  async () => {
    const res = await getSubscriptions();
    return res.data;
  }
);

export const addSubscription = createAsyncThunk(
  'subscriptions/addSubscription',
  async (subscriptionData) => {
    const res = await createSubscription(subscriptionData);
    return res.data;
  }
);

export const removeSubscription = createAsyncThunk(
  'subscriptions/removeSubscription',
  async (subscriptionId) => {
    await deleteSubscription(subscriptionId);
    return subscriptionId;
  }
);

const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState: {
    subscriptions: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSubscriptions: (state, action) => {
      state.subscriptions = action.payload
    },
    clearSubscriptions: (state) => {
      state.subscriptions = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addSubscription.fulfilled, (state, action) => {
        state.subscriptions.push(action.payload);
      })

      .addCase(removeSubscription.fulfilled, (state, action) => {
        state.subscriptions = state.subscriptions.filter(
          (sub) => sub._id !== action.payload
        );
      });
  }
});

export const { setSubscriptions, clearSubscriptions } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
