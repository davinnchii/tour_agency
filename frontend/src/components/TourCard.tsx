"use client"

import type React from "react"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "../store"
import { addRequest } from "@/features/requests/requestsSlice"
import { removeTour } from "../features/tours/tourSlice"
import { toastSuccess, toastError } from "../utils/toast"
import { getCountryTranslationKey } from "../utils/countryHelpers"
import type { Tour, PopulatedTour, Request } from "../types"
import { useAppData } from "@/hooks"

interface TourCardProps {
  tour: Tour | PopulatedTour
  variant?: "default" | "compact"
  showActions?: boolean
  userRequests?: Request[]
  onRequestCreated?: () => void
}

const TourCard: React.FC<TourCardProps> = ({
  tour,
  variant = "default",
  showActions = true,
  userRequests = [],
}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const { loading: actionLoading } = useAppSelector((state) => state.requests)
  const { refreshData } = useAppData();

  const isOperator = user?.role === "operator"
  const isAgent = user?.role === "agent"
  const isOwner = isOperator && typeof tour.operator === "object" && tour.operator._id === user._id

  // Check if current user already has a request for this tour
  const existingRequest = userRequests.find((request) => {
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
      createdBy: user._id,
    }

    try {
      await dispatch(addRequest(requestData)).unwrap()
      toastSuccess(t("tours.requestCreated"))
      await refreshData.requests() 
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

  // Get translated country name
  const getCountryDisplayName = (countryValue: string) => {
    const translationKey = getCountryTranslationKey(countryValue)
    const translated = t(translationKey)
    // If translation key is not found, return the original value
    return translated === translationKey ? countryValue : translated
  }

  // Get button text and style based on request status
  const getRequestButtonProps = () => {
    if (!hasExistingRequest) {
      return {
        text: t("tours.submitRequest"),
        className: "btn btn-primary flex-1",
        disabled: actionLoading,
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
      <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-900/50 hover:border-blue-300 dark:hover:border-green-500">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-bold text-xl mb-2 text-gray-900 dark:text-gray-100">{tour.title}</h4>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">{getCountryDisplayName(tour.country)}</p>
            <p className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-green-400 dark:to-green-500 bg-clip-text text-transparent">
              {tour.price} грн
            </p>
          </div>
          {showActions && isAgent && (
            <div className="ml-4">
              <button
                onClick={handleCreateRequest}
                className={`${buttonProps.className} px-4 py-2 text-sm`}
                disabled={buttonProps.disabled}
                title={hasExistingRequest ? t("tours.requestAlreadyExists") : ""}
              >
                {buttonProps.text}
              </button>
              {hasExistingRequest && (
                <div className="text-xs text-gray-500 mt-2 text-center font-medium">{t(`tours.status.${requestStatus}`)}</div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  const buttonProps = getRequestButtonProps()

  return (
    <div className="card hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 dark:border-gray-700 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-900/50">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{tour.title}</h3>
            {isOwner && (
              <span className="bg-gradient-to-r from-green-400 to-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                {t("tours.yourTour")}
              </span>
            )}
            {hasExistingRequest && isAgent && (
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full shadow-md ${
                  requestStatus === "pending"
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
                    : requestStatus === "approved"
                      ? "bg-gradient-to-r from-green-400 to-green-500 text-white"
                      : requestStatus === "rejected"
                        ? "bg-gradient-to-r from-red-400 to-red-500 text-white"
                        : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                }`}
              >
                {t(`tours.status.${requestStatus}`)}
              </span>
            )}
          </div>
          {tour.description && (
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-2">{tour.description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5 p-4 bg-white/60 dark:bg-gray-700/60 rounded-lg border border-gray-100 dark:border-gray-600">
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{t("tours.country")}</span>
          <span className="text-base font-semibold text-gray-900 dark:text-gray-100">{getCountryDisplayName(tour.country)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{t("tours.price")}</span>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-green-400 dark:to-green-500 bg-clip-text text-transparent">
            {tour.price} грн
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{t("tours.startDate")}</span>
          <span className="text-base font-medium text-gray-900 dark:text-gray-100">{formatDate(tour.startDate)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{t("tours.endDate")}</span>
          <span className="text-base font-medium text-gray-900 dark:text-gray-100">{formatDate(tour.endDate)}</span>
        </div>
      </div>

      <div className="mb-5 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-green-900/30 dark:to-green-800/20 rounded-lg border border-purple-100 dark:border-green-700/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t("tours.operator")}:</span>
          <span className="text-base font-bold text-purple-700 dark:text-green-400">{operatorName}</span>
        </div>
      </div>

      {showActions && (
        <div className="flex gap-3 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
          {isAgent && (
            <div className="flex-1">
              <button
                onClick={handleCreateRequest}
                className={`${buttonProps.className} w-full`}
                disabled={buttonProps.disabled}
                title={hasExistingRequest ? t("tours.requestAlreadyExists") : ""}
              >
                {actionLoading && !hasExistingRequest ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    {t("common.loading")}
                  </span>
                ) : (
                  buttonProps.text
                )}
              </button>
              {hasExistingRequest && (
                <p className="text-xs text-gray-500 mt-2 text-center font-medium">{t("tours.requestAlreadyExistsMessage")}</p>
              )}
            </div>
          )}
          {isOwner && (
            <button 
              onClick={handleDeleteTour} 
              className="btn bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md px-6"
            >
              {t("tours.delete")}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default TourCard
