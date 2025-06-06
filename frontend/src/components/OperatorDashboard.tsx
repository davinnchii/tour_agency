"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { fetchTours } from "../features/tours/tourSlice"
import { fetchRequests, removeRequest } from "@/features/requests/requestsSlice"
import { CreateTourForm } from "./CreateTourForm"
import TourSearchResults from "@/components/TourSearchResult";
import type { PopulatedRequest, Request } from "../types"

const OperatorDashboard: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const user = useAppSelector((state) => state.auth.user)
  const { requests, loaded } = useAppSelector((state) => state.requests)

  const [activeTab, setActiveTab] = useState<"tours" | "requests" | "create">("tours")
  const [showModal, setShowModal] = useState<boolean>(false)

  useEffect(() => {
    dispatch(fetchTours()).unwrap()
  }, [dispatch])


  const handleDeleteRequest = async (id: string): Promise<void> => {
    try {
      await dispatch(removeRequest(id)).unwrap()
      await dispatch(fetchRequests()).unwrap()
      alert(t("operatorDashboard.requestDeleted"))
    } catch (err) {
      console.error(err)
      alert(t("operatorDashboard.requestDeleteError"))
    }
  }

  const handleFetchRequests = async (): Promise<void> => {
    if (!loaded) {
      try {
        await dispatch(fetchRequests()).unwrap()
      } catch (err) {
        console.error(t("operatorDashboard.requestsLoadError"), err)
      }
    }
  }

  const handleCloseModal = async (): Promise<void> => {
    await dispatch(fetchTours()).unwrap()
    setShowModal(false)
  }

  const operatorRequests = requests.filter((req) => {
    const populatedReq = req as Request
    return populatedReq.tour?.operator?._id === user?._id
  })

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
            onClick={() => {
              setActiveTab("requests")
              handleFetchRequests()
            }}
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
          <CreateTourForm onClose={() => setActiveTab("tours")} />
        </div>
      )}

      {activeTab === "requests" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">{t("operatorDashboard.requestsOnTours")}</h3>
          {operatorRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">{t("operatorDashboard.noRequests")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {operatorRequests.map((req) => {
                const populatedReq = req as Request
                return (
                  <div key={req._id} className="card">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">{populatedReq.tour.title}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">{t("operatorDashboard.client")}:</span>
                            <span className="ml-2">{req.customerName}</span>
                          </div>
                          <div>
                            <span className="font-medium">{t("operatorDashboard.email")}:</span>
                            <span className="ml-2">{req.customerEmail}</span>
                          </div>
                          <div>
                            <span className="font-medium">{t("requests.status")}:</span>
                            <span
                              className={`ml-2 px-2 py-1 rounded text-xs ${
                                req.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : req.status === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {t(`requests.status.${req.status}`)}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">{t("tours.price")}:</span>
                            <span className="ml-2 font-bold text-blue-600">{populatedReq.tour.price} грн</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteRequest(req._id)}
                        className="btn bg-red-500 text-white hover:bg-red-600 ml-4"
                      >
                        {t("operatorDashboard.delete")}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default OperatorDashboard
