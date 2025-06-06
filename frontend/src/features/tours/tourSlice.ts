import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { createTour, deleteTour, getTours, searchTours } from "../../api/tourService"
import type { Tour, CreateTourPayload, TourSearchParams, PaginatedToursResponse } from "../../types"

interface TourState {
  tours: Tour[]
  pagination: {
    page: number
    totalPages: number
    total: number
  }
  loading: boolean
  error: string | null
  searchResults: Tour[]
  searchPagination: {
    page: number
    totalPages: number
    total: number
  }
  searchLoading: boolean
}

const initialState: TourState = {
  tours: [],
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
  },
  loading: false,
  error: null,
  searchResults: [],
  searchPagination: {
    page: 1,
    totalPages: 1,
    total: 0,
  },
  searchLoading: false,
}

export const fetchTours = createAsyncThunk<PaginatedToursResponse, TourSearchParams | undefined>(
  "tours/fetchTours",
  async (params) => {
    try {
      const response = await getTours(params)
      // Ensure we always return PaginatedToursResponse structure
      if (response.data?.data) {
        return response.data.data as PaginatedToursResponse
      }
      return response.data as PaginatedToursResponse
    } catch (error) {
      throw error
    }
  },
)

export const searchToursAsync = createAsyncThunk<PaginatedToursResponse, TourSearchParams>(
  "tours/searchTours",
  async (searchParams: TourSearchParams) => {
    try {
      const response = await searchTours(searchParams)
      // Ensure we always return PaginatedToursResponse structure
      if (response.data?.data) {
        return response.data.data as PaginatedToursResponse
      }
      return response.data as PaginatedToursResponse
    } catch (error) {
      throw error
    }
  },
)

export const addTour = createAsyncThunk<Tour, CreateTourPayload>(
  "tours/addTour",
  async (tourData: CreateTourPayload) => {
    try {
      const response = await createTour(tourData)
      // Ensure we always return Tour structure
      if (response.data?.data) {
        return response.data.data as Tour
      }
      return response.data as Tour
    } catch (error) {
      throw error
    }
  },
)

export const removeTour = createAsyncThunk<string, string>("tours/removeTour", async (tourId: string) => {
  await deleteTour(tourId)
  return tourId
})

const tourSlice = createSlice({
  name: "tours",
  initialState,
  reducers: {
    clearTours: (state) => {
      state.tours = []
      state.pagination = {
        page: 1,
        totalPages: 1,
        total: 0,
      }
    },
    clearSearchResults: (state) => {
      state.searchResults = []
      state.searchPagination = {
        page: 1,
        totalPages: 1,
        total: 0,
      }
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload
    },
    setSearchPage: (state, action: PayloadAction<number>) => {
      state.searchPagination.page = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tours
      .addCase(fetchTours.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTours.fulfilled, (state, action) => {
        state.loading = false
        state.tours = action.payload.tours
        state.pagination = {
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
        }
      })
      .addCase(fetchTours.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch tours"
      })
      // Search tours
      .addCase(searchToursAsync.pending, (state) => {
        state.searchLoading = true
        state.error = null
      })
      .addCase(searchToursAsync.fulfilled, (state, action) => {
        state.searchLoading = false
        state.searchResults = action.payload.tours
        state.searchPagination = {
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
        }
      })
      .addCase(searchToursAsync.rejected, (state, action) => {
        state.searchLoading = false
        state.error = action.error.message || "Failed to search tours"
      })
      // Add tour
      .addCase(addTour.fulfilled, (state, action) => {
        state.tours.push(action.payload)
        state.pagination.total += 1
      })
      // Remove tour
      .addCase(removeTour.fulfilled, (state, action) => {
        state.tours = state.tours.filter((tour) => tour._id !== action.payload)
        state.searchResults = state.searchResults.filter((tour) => tour._id !== action.payload)
        state.pagination.total = Math.max(0, state.pagination.total - 1)
      })
  },
})

export const { clearTours, clearSearchResults, setPage, setSearchPage } = tourSlice.actions
export default tourSlice.reducer
