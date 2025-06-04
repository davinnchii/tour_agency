import api from "../utils/api"
import type { Request, CreateRequestPayload, UpdateRequestPayload, ApiResponse } from "../types"

export const createRequest = (data: CreateRequestPayload) => api.post<ApiResponse<Request>>("/api/requests", data)

export const getRequests = () => api.get<ApiResponse<Request[]>>("/api/requests")

export const deleteRequest = (id: string | number) => api.delete(`/api/requests/${id}`)

export const updateRequestStatus = (id: string, status: "pending" | "approved" | "rejected") =>
  api.patch<ApiResponse<Request>>(`/api/requests/${id}/status`, { status })

export const getRequestById = (id: string) => api.get<ApiResponse<Request>>(`/api/requests/${id}`)

export const updateRequest = (id: string, data: UpdateRequestPayload) =>
  api.patch<ApiResponse<Request>>(`/api/requests/${id}`, data)
