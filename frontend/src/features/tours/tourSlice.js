// src/features/tours/tourSlice.js (приклад з tours)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTours as apiFetchTours, createTour, deleteTour } from '../../api/tourService';

export const fetchTours = createAsyncThunk('tours/fetchTours', async () => {
  const res = await apiFetchTours();
  return res.data.tours;
});

export const addTour = createAsyncThunk('tours/addTour', async (tourData) => {
  const res = await createTour(tourData);
  return res.data;
});

export const removeTour = createAsyncThunk('tours/removeTour', async (tourId) => {
  await deleteTour(tourId);
  return tourId;
});

const tourSlice = createSlice({
  name: 'tours',
  initialState: { tours: [], loading: false, error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTours.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTours.fulfilled, (state, action) => { state.loading = false; state.tours = action.payload; })
      .addCase(fetchTours.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

      .addCase(addTour.fulfilled, (state, action) => { state.tours.push(action.payload); })

      .addCase(removeTour.fulfilled, (state, action) => {
        state.tours = state.tours.filter(tour => tour._id !== action.payload);
      });
  }
});

export default tourSlice.reducer;
