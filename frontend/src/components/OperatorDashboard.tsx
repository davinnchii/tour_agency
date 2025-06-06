"use client"

import React from "react"
import { useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "../store"
import { removeRequest, updateRequestStatus } from "@/features/requests/requestsSlice"
import { toastSuccess, toastError, toastInfo } from "../utils/toast"
import { useAppData, useLazyData } from "../hooks"
import { selectOperatorRequests } from "../store/selectors"
import { CreateTourForm } from "./CreateTourForm"
import TourSearchResults from "@/components/TourSearchResult"
import type { PopulatedRequest } from "../types"

const OperatorDashboard: React.FC = React.memo(() => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { loadRequests } = useLazyData()

  const user = useAppSelector((state) => state.auth.user)
  const operatorRequests = useAppSelector(selectOperatorRequests)
  const { loading } = useAppSelector((state) => state.requests)

  const [activeTab, setActiveTab] = useState<"tours" | "requests" | "create">("tours")

  // Initialize app data
  useAppData()

  const handleDeleteRequest = useCallback(
    async (id: string) => {
      try {
        await dispatch(removeRequest(id)).unwrap()
        toastSuccess(t("operatorDashboard.requestDeleted"))
      } catch (err) {
        console.error(err)
        toastError(t("operatorDashboard.requestDeleteError"))
      }
    },
    [dispatch, t],
  )

  const handleUpdateRequestStatus = useCallback(
    async (id: string, status: "pending" | "approved" | "rejected") => {
      try {
        dispatch(updateRequestStatus({ id, status }));

        const statusMessages = {
          pending: t("operatorDashboard.requestStatusPending"),
          approved: t("operatorDashboard.requestStatusApproved"),
          rejected: t("operatorDashboard.requestStatusRejected"),
        }

        toastSuccess(statusMessages[status] || t("operatorDashboard.requestStatusUpdated"))
      } catch (err) {
        console.error(err)
        toastError(t("operatorDashboard.requestStatusUpdateError"))
      }
    },
    [dispatch, t],
  )

  const handleRequestsTabClick = useCallback(async () => {
    setActiveTab("requests")
    // Lazy load requests only when needed
    await loadRequests()
  }, [loadRequests])

  const handleTourCreated = useCallback(() => {
    setActiveTab("tours")
    toastInfo(t("operatorDashboard.tourListRefreshed"))
  }, [t])

  if (!user) {
    return <div>{t("common.loading")}</div>
  }

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("tours")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "tours"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("operatorDashboard.allTours")}
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "create"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("operatorDashboard.createTour")}
          </button>
          <button
            onClick={handleRequestsTabClick}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "requests"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("operatorDashboard.requests")} ({operatorRequests.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "tours" && <TourSearchResults />}

      {activeTab === "create" && (
        <div className="max-w-2xl">
          <h3 className="text-lg font-semibold mb-4">{t("operatorDashboard.createNewTour")}</h3>
          <CreateTourForm onClose={handleTourCreated} />
        </div>
      )}

      {activeTab === "requests" && (
        <OperatorRequestsList
          requests={operatorRequests as PopulatedRequest[]}
          actionLoading={loading}
          onDeleteRequest={handleDeleteRequest}
          onUpdateStatus={handleUpdateRequestStatus}
        />
      )}
    </div>
  )
})

// Memoized requests list component
const OperatorRequestsList = React.memo<{
  requests: PopulatedRequest[]
  actionLoading: boolean
  onDeleteRequest: (id: string) => void
  onUpdateStatus: (id: string, status: "pending" | "approved" | "rejected") => void
}>(({ requests, actionLoading, onDeleteRequest, onUpdateStatus }) => {
  const { t } = useTranslation()

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{t("operatorDashboard.requestsOnTours")}</h3>
      {requests.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">{t("operatorDashboard.noRequests")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <RequestCard
              key={req._id}
              request={req}
              actionLoading={actionLoading}
              onDelete={onDeleteRequest}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  )
})

// Memoized individual request card
const RequestCard = React.memo<{
  request: PopulatedRequest
  actionLoading: boolean
  onDelete: (id: string) => void
  onUpdateStatus: (id: string, status: "pending" | "approved" | "rejected") => void
}>(({ request, actionLoading, onDelete, onUpdateStatus }) => {
  const { t } = useTranslation()

  return (
    <div className="card">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold text-lg mb-2">{request.tour.title}</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">{t("operatorDashboard.client")}:</span>
              <span className="ml-2">{request.customerName}</span>
            </div>
            <div>
              <span className="font-medium">{t("operatorDashboard.email")}:</span>
              <span className="ml-2">{request.customerEmail}</span>
            </div>
            <div>
              <span className="font-medium">{t("requests.status")}:</span>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs ${
                  request.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : request.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {t(`requests.status.${request.status}`)}
              </span>
            </div>
            <div>
              <span className="font-medium">{t("tours.price")}:</span>
              <span className="ml-2 font-bold text-blue-600">{request.tour.price} грн</span>
            </div>
          </div>

          {/* Status update buttons */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onUpdateStatus(request._id, "approved")}
              disabled={request.status === "approved" || actionLoading}
              className={`px-3 py-1 text-sm rounded ${
                request.status === "approved"
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {t("requests.approve")}
            </button>
            <button
              onClick={() => onUpdateStatus(request._id, "rejected")}
              disabled={request.status === "rejected" || actionLoading}
              className={`px-3 py-1 text-sm rounded ${
                request.status === "rejected"
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {t("requests.reject")}
            </button>
            <button
              onClick={() => onUpdateStatus(request._id, "pending")}
              disabled={request.status === "pending" || actionLoading}
              className={`px-3 py-1 text-sm rounded ${
                request.status === "pending"
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-yellow-500 text-white hover:bg-yellow-600"
              }`}
            >
              {t("requests.markPending")}
            </button>
          </div>
        </div>
        <button
          onClick={() => onDelete(request._id)}
          disabled={actionLoading}
          className="btn bg-red-500 text-white hover:bg-red-600 ml-4 disabled:opacity-50"
        >
          {actionLoading ? t("common.loading") : t("operatorDashboard.delete")}
        </button>
      </div>
    </div>
  )
})

OperatorDashboard.displayName = "OperatorDashboard"
OperatorRequestsList.displayName = "OperatorRequestsList"
RequestCard.displayName = "RequestCard"

export default OperatorDashboard
