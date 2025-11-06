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
    <div className="space-y-6 animate-fade-in">
      {/* Navigation Tabs */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-2 transition-colors duration-300">
        <nav className="flex space-x-2">
          <button
            onClick={() => setActiveTab("tours")}
            className={`py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-200 ${
              activeTab === "tours"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 dark:from-green-500 dark:to-green-600 text-white shadow-lg transform scale-105"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {t("operatorDashboard.allTours")}
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-200 ${
              activeTab === "create"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 dark:from-green-500 dark:to-green-600 text-white shadow-lg transform scale-105"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {t("operatorDashboard.createTour")}
          </button>
          <button
            onClick={handleRequestsTabClick}
            className={`py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-200 relative ${
              activeTab === "requests"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 dark:from-green-500 dark:to-green-600 text-white shadow-lg transform scale-105"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {t("operatorDashboard.requests")}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === "requests" ? "bg-white/30" : "bg-blue-100 dark:bg-green-900/50 text-blue-700 dark:text-green-300"
            }`}>
              {operatorRequests.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "tours" && <TourSearchResults />}

      {activeTab === "create" && (
        <div className="max-w-2xl">
          <h3 className="text-2xl font-bold mb-6 gradient-text">{t("operatorDashboard.createNewTour")}</h3>
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
          <p className="text-gray-600 dark:text-gray-400">{t("operatorDashboard.noRequests")}</p>
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
    <div className="card bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-900/50 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-green-500">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-bold text-xl mb-4 text-gray-900 dark:text-gray-100">{request.tour.title}</h4>
          <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-white/60 dark:bg-gray-700/60 rounded-lg border border-gray-100 dark:border-gray-600">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{t("operatorDashboard.client")}</span>
              <span className="text-base font-semibold text-gray-900 dark:text-gray-100">{request.customerName}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{t("operatorDashboard.email")}</span>
              <span className="text-base font-medium text-gray-700 dark:text-gray-300">{request.customerEmail}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{t("requests.status")}</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${
                  request.status === "pending"
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
                    : request.status === "approved"
                      ? "bg-gradient-to-r from-green-400 to-green-500 text-white"
                      : "bg-gradient-to-r from-red-400 to-red-500 text-white"
                }`}
              >
                {t(`requests.status.${request.status}`)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{t("tours.price")}</span>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-green-400 dark:to-green-500 bg-clip-text text-transparent">
                {request.tour.price} грн
              </span>
            </div>
          </div>

          {/* Status update buttons */}
          <div className="mt-4 flex gap-2 flex-wrap">
            <button
              onClick={() => onUpdateStatus(request._id, "approved")}
              disabled={request.status === "approved" || actionLoading}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                request.status === "approved"
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {t("requests.approve")}
            </button>
            <button
              onClick={() => onUpdateStatus(request._id, "rejected")}
              disabled={request.status === "rejected" || actionLoading}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                request.status === "rejected"
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {t("requests.reject")}
            </button>
            <button
              onClick={() => onUpdateStatus(request._id, "pending")}
              disabled={request.status === "pending" || actionLoading}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                request.status === "pending"
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {t("requests.markPending")}
            </button>
          </div>
        </div>
        <button
          onClick={() => onDelete(request._id)}
          disabled={actionLoading}
          className="btn bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 ml-4 disabled:opacity-50 shadow-md"
        >
          {actionLoading ? (
            <span className="flex items-center">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              {t("common.loading")}
            </span>
          ) : (
            t("operatorDashboard.delete")
          )}
        </button>
      </div>
    </div>
  )
})

OperatorDashboard.displayName = "OperatorDashboard"
OperatorRequestsList.displayName = "OperatorRequestsList"
RequestCard.displayName = "RequestCard"

export default OperatorDashboard
