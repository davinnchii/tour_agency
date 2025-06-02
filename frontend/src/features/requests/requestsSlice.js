import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createRequest, getRequests, deleteRequest } from '../../api/requestService';

export const fetchRequests = createAsyncThunk('requests/getReqests', async () => {
  const res = await getRequests();
  return res.data;
});

export const addRequest = createAsyncThunk('requests/createRequest', async (requestData) => {
  const res = await createRequest(requestData);
  return res.data;
});

export const removeRequest = createAsyncThunk('requests/deleteRequest', async (requestId) => {
  await deleteRequest(requestId);
  return requestId;
});

const requestsSlice = createSlice({
  name: 'requests',
  initialState: {
    requests: [],
    loaded: false,
    loading: false,
    error: null,
  },
  reducers: {
    setRequests: (state, action) => {
        state.requests = action.payload;
    },
    clearRequests: (state) => {
      state.requests = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
        state.loaded = true;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addRequest.fulfilled, (state, action) => {
        state.requests.push(action.payload);
      })

      .addCase(removeRequest.fulfilled, (state, action) => {
        state.requests = state.requests.filter(r => r._id !== action.payload);
      });
  }
});

export const { clearRequests, setRequests } = requestsSlice.actions;
export default requestsSlice.reducer;
