import api from "../utils/api"
import { buildApiUrl } from "../utils/queryHelpers"
import type {
  Tour,
  CreateTourPayload,
  UpdateTourPayload,
  ApiResponse,
  TourSearchParams,
  PaginatedToursResponse,
} from "../types"

export const getTours = (params?: TourSearchParams | any) => {
  const url = buildApiUrl("/api/tours", params)
  return api.get<ApiResponse<PaginatedToursResponse>>(url)
}

export const searchTours = (params: TourSearchParams) => {
  const url = buildApiUrl("/api/tours", params)
  return api.get<ApiResponse<PaginatedToursResponse>>(url)
}

export const createTour = (data: CreateTourPayload) => api.post<ApiResponse<Tour>>("/api/tours", data)

export const deleteTour = (id: string | number) => api.delete(`/api/tours/${id}`)

export const getTourById = (id: string) => api.get<ApiResponse<Tour>>(`/api/tours/${id}`)

export const updateTour = (id: string, data: UpdateTourPayload) =>
  api.patch<ApiResponse<Tour>>(`/api/tours/${id}`, data)
