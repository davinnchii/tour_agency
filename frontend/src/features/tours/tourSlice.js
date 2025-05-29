import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tours: [],
  status: 'idle',
  error: null,
};

const tourSlice = createSlice({
  name: 'tours',
  initialState,
  reducers: {
    setTours(state, action) {
      state.tours = action.payload;
    },
  },
});

export const { setTours } = tourSlice.actions;
export default tourSlice.reducer;
