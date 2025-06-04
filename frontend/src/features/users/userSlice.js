import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchOperators } from '../../api/userService';

export const getOperators = createAsyncThunk('users/getOperators', async () => {
  const res = await fetchOperators();
  return res.data;
});

const userSlice = createSlice({
  name: 'operators',
  initialState: {
    operators: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOperators.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOperators.fulfilled, (state, action) => {
        state.loading = false;
        state.operators = action.payload;
      })
      .addCase(getOperators.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default userSlice.reducer;
