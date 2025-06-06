"use client"

import type React from "react"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { addRequest } from "@/features/requests/requestsSlice"
import { removeTour } from "../features/tours/tourSlice"
import { toastSuccess, toastError } from "../utils/toast"
import type { Tour, PopulatedTour, Request } from "../types"

interface TourCardProps {
  tour: Tour | PopulatedTour
  variant?: "default" | "compact"
  showActions?: boolean
  userRequests?: Request[] // Add prop for user's requests
}

const TourCard: React.FC<TourCardProps> = ({ tour, variant = "default", showActions = true, userRequests = [] }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const { loading } = useAppSelector((state) => state.requests)

  const isOperator = user?.role === "operator"
  const isAgent = user?.role === "agent"
  const isOwner = isOperator && typeof tour.operator === "object" && tour.operator._id === user._id

  // Check if current user already has a request for this tour
  const existingRequest = userRequests.find((request) => {
    // Handle both string and object references for tour
    const tourId = typeof request.tour === "string" ? request.tour : request.tour._id
    return tourId === tour._id && request.createdBy._id === user?._id
  })

  const hasExistingRequest = !!existingRequest
  const requestStatus = existingRequest?.status

  const handleCreateRequest = async () => {
    if (!user || !isAgent || hasExistingRequest) return

    const requestData = {
      tour: tour._id,
      customerName: user.name,
      customerEmail: user.email,
      createdBy: user._id, // Use 'id' to match backend format
    }

    try {
      await dispatch(addRequest(requestData)).unwrap()
      toastSuccess(t("tours.requestCreated"))
    } catch (error) {
      console.error("Failed to create request:", error)
      toastError(t("tours.requestError"))
    }
  }

  const handleDeleteTour = async () => {
    if (!isOwner) return

    if (window.confirm(t("tours.confirmDelete"))) {
      try {
        await dispatch(removeTour(tour._id)).unwrap()
        toastSuccess(t("tours.tourDeleted"))
      } catch (error) {
        console.error("Failed to delete tour:", error)
        toastError(t("tours.deleteError"))
      }
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return t("tours.dateNotSet")
    return new Date(dateString).toLocaleDateString()
  }

  const operatorName = typeof tour.operator === "object" ? tour.operator.name : "Unknown Operator"

  // Get button text and style based on request status
  const getRequestButtonProps = () => {
    if (!hasExistingRequest) {
      return {
        text: t("tours.submitRequest"),
        className: "btn btn-primary flex-1",
        disabled: loading,
      }
    }

    switch (requestStatus) {
      case "pending":
        return {
          text: t("tours.requestPending"),
          className: "btn bg-yellow-500 text-white flex-1 cursor-not-allowed",
          disabled: true,
        }
      case "approved":
        return {
          text: t("tours.requestApproved"),
          className: "btn bg-green-500 text-white flex-1 cursor-not-allowed",
          disabled: true,
        }
      case "rejected":
        return {
          text: t("tours.requestRejected"),
          className: "btn bg-red-500 text-white flex-1 cursor-not-allowed",
          disabled: true,
        }
      default:
        return {
          text: t("tours.requestSent"),
          className: "btn bg-gray-500 text-white flex-1 cursor-not-allowed",
          disabled: true,
        }
    }
  }

  if (variant === "compact") {
    const buttonProps = getRequestButtonProps()

    return (
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-semibold text-lg mb-1">{tour.title}</h4>
            <p className="text-sm text-gray-600 mb-2">{tour.country}</p>
            <p className="text-lg font-bold text-blue-600">{tour.price} грн</p>
          </div>
          {showActions && isAgent && (
            <div className="ml-2">
              <button
                onClick={handleCreateRequest}
                className={`${buttonProps.className} btn-sm`}
                disabled={buttonProps.disabled}
                title={hasExistingRequest ? t("tours.requestAlreadyExists") : ""}
              >
                {buttonProps.text}
              </button>
              {hasExistingRequest && (
                <div className="text-xs text-gray-500 mt-1 text-center">{t(`tours.status.${requestStatus}`)}</div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  const buttonProps = getRequestButtonProps()

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{tour.title}</h3>
          {tour.description && <p className="text-gray-600 mb-3">{tour.description}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          {isOwner && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{t("tours.yourTour")}</span>
          )}
          {hasExistingRequest && isAgent && (
            <span
              className={`text-xs px-2 py-1 rounded ${
                requestStatus === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : requestStatus === "approved"
                    ? "bg-green-100 text-green-800"
                    : requestStatus === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
              }`}
            >
              {t(`tours.status.${requestStatus}`)}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="font-medium text-gray-700">{t("tours.country")}:</span>
          <span className="ml-2">{tour.country}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">{t("tours.price")}:</span>
          <span className="ml-2 font-bold text-blue-600">{tour.price} грн</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">{t("tours.startDate")}:</span>
          <span className="ml-2">{formatDate(tour.startDate)}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">{t("tours.endDate")}:</span>
          <span className="ml-2">{formatDate(tour.endDate)}</span>
        </div>
      </div>

      <div className="mb-4 text-sm">
        <span className="font-medium text-gray-700">{t("tours.operator")}:</span>
        <span className="ml-2">{operatorName}</span>
      </div>

      {showActions && (
        <div className="flex gap-2 pt-3 border-t">
          {isAgent && (
            <div className="flex-1">
              <button
                onClick={handleCreateRequest}
                className={buttonProps.className}
                disabled={buttonProps.disabled}
                title={hasExistingRequest ? t("tours.requestAlreadyExists") : ""}
              >
                {loading && !hasExistingRequest ? t("common.loading") : buttonProps.text}
              </button>
              {hasExistingRequest && (
                <p className="text-xs text-gray-500 mt-1 text-center">{t("tours.requestAlreadyExistsMessage")}</p>
              )}
            </div>
          )}
          {isOwner && (
            <>
              <button className="btn btn-secondary flex-1">{t("tours.edit")}</button>
              <button onClick={handleDeleteTour} className="btn bg-red-500 text-white hover:bg-red-600">
                {t("tours.delete")}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default TourCard
