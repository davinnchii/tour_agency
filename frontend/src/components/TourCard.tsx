"use client"

import type React from "react"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { addRequest } from "@/features/requests/requestsSlice"
import { removeTour } from "@/features/tours/tourSlice"
import type { Tour, PopulatedTour } from "../types"

interface TourCardProps {
  tour: Tour | PopulatedTour
  variant?: "default" | "compact"
  showActions?: boolean
}

const TourCard: React.FC<TourCardProps> = ({ tour, variant = "default", showActions = true }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  const isOperator = user?.role === "operator"
  const isAgent = user?.role === "agent"
  const isOwner = isOperator && typeof tour.operator === "object" && tour.operator._id === user._id

  const handleCreateRequest = async () => {
    if (!user || !isAgent) return

    const requestData = {
      tour: tour._id,
      customerName: user.name,
      customerEmail: user.email,
      createdBy: user._id,
    }

    try {
      await dispatch(addRequest(requestData)).unwrap()
      alert(t("tours.requestCreated"))
    } catch (error) {
      console.error("Failed to create request:", error)
      alert(t("tours.requestError"))
    }
  }

  const handleDeleteTour = async () => {
    if (!isOwner) return

    if (window.confirm(t("tours.confirmDelete"))) {
      try {
        await dispatch(removeTour(tour._id)).unwrap()
        alert(t("tours.tourDeleted"))
      } catch (error) {
        console.error("Failed to delete tour:", error)
        alert(t("tours.deleteError"))
      }
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return t("tours.dateNotSet")
    return new Date(dateString).toLocaleDateString()
  }

  const operatorName = typeof tour.operator === "object" ? tour.operator.name : "Unknown Operator"

  if (variant === "compact") {
    return (
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-semibold text-lg mb-1">{tour.title}</h4>
            <p className="text-sm text-gray-600 mb-2">{tour.country}</p>
            <p className="text-lg font-bold text-blue-600">{tour.price} грн</p>
          </div>
          {showActions && isAgent && (
            <button onClick={handleCreateRequest} className="btn btn-primary btn-sm">
              {t("tours.submitRequest")}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{tour.title}</h3>
          {tour.description && <p className="text-gray-600 mb-3">{tour.description}</p>}
        </div>
        {isOwner && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{t("tours.yourTour")}</span>
        )}
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
            <button onClick={handleCreateRequest} className="btn btn-primary flex-1">
              {t("tours.submitRequest")}
            </button>
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
