"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { fetchTours } from "../features/tours/tourSlice"
import { fetchSubscriptions, addSubscription, removeSubscription } from "../features/subscriptions/subscriptionSlice"
import { fetchRequests, removeRequest } from "@/features/requests/requestsSlice"
import { getOperators } from "../features/users/userSlice"
import { toastSuccess, toastError } from "../utils/toast"
import TourSearchResults from "./TourSearchResult"
import type { User, PopulatedSubscription, PopulatedRequest } from "../types"

const AgentDashboard: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const user = useAppSelector((state) => state.auth.user)
  const { operators, loading } = useAppSelector((state) => state.users)
  const subscriptions = useAppSelector((state) => state.subscriptions.subscriptions) as PopulatedSubscription[]
  const { requests, loaded, loading: requestsLoading } = useAppSelector((state) => state.requests)

  const [activeTab, setActiveTab] = useState<"tours" | "operators" | "requests">("tours")

  useEffect(() => {
    dispatch(getOperators()).unwrap()
    dispatch(fetchTours()).unwrap()
    dispatch(fetchSubscriptions()).unwrap()
    // Fetch requests immediately for agents to check existing requests
    if (user?.role === "agent") {
      dispatch(fetchRequests()).unwrap()
    }
  }, [dispatch, user?.role])

  const handleSubscribe = async (operator: User): Promise<void> => {
    if (!user) return

    const data = {
      agency: user._id, // Use 'id' to match backend format
      operator: operator._id,
    }

    try {
      await dispatch(addSubscription(data)).unwrap()
      await dispatch(fetchSubscriptions()).unwrap()
      toastSuccess(t("agentDashboard.subscriptionCreated"))
    } catch (err) {
      console.error(t("agentDashboard.subscriptionCreateError"), err)
      toastError(t("agentDashboard.subscriptionCreateErrorAlert"))
    }
  }

  const handleDeleteSubscription = async (id: string): Promise<void> => {
    try {
      await dispatch(removeSubscription(id)).unwrap()
      await dispatch(fetchSubscriptions()).unwrap()
      toastSuccess(t("agentDashboard.subscriptionDeleted"))
    } catch (err) {
      console.error(t("agentDashboard.subscriptionDeleteError"), err)
      toastError(t("agentDashboard.subscriptionDeleteError"))
    }
  }

  const handleDeleteRequest = async (id: string): Promise<void> => {
    try {
      await dispatch(removeRequest(id)).unwrap()
      toastSuccess(t("agentDashboard.requestDeleted"))
    } catch (err) {
      console.error(err)
      toastError(t("agentDashboard.requestDeleteError"))
    }
  }

  const handleFetchRequests = async (): Promise<void> => {
    if (!loaded) {
      try {
        await dispatch(fetchRequests()).unwrap()
      } catch (err) {
        console.error(err)
        toastError(t("agentDashboard.requestsLoadError"))
      }
    }
  }

  // Filter requests for current user
  const userRequests = requests.filter((request) => request.createdBy._id === user?._id)

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
            {t("agentDashboard.searchTours")}
          </button>
          <button
            onClick={() => setActiveTab("operators")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "operators"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t("agentDashboard.operators")}
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
            {t("agentDashboard.myRequests")} ({userRequests.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "tours" && <TourSearchResults userRequests={userRequests} />}

      {activeTab === "operators" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">{t("agentDashboard.operatorList")}</h3>
          {loading ? (
            <p>{t("agentDashboard.loading")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {operators.map((op) => {
                const isSubscribed = subscriptions.some((sub) => sub.operator && sub.operator._id === op._id)

                return (
                  <div key={op._id} className="card flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-lg">{op.name}</h4>
                      <p className="text-sm text-gray-600">{op.email}</p>
                    </div>
                    <div>
                      {isSubscribed ? (
                        <button
                          onClick={() => {
                            const sub = subscriptions.find((s) => s.operator && s.operator._id === op._id)
                            if (sub) handleDeleteSubscription(sub._id)
                          }}
                          disabled={loading}
                          className="btn bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                        >
                          {loading ? t("common.loading") : t("agentDashboard.unsubscribe")}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSubscribe(op)}
                          disabled={loading}
                          className="btn btn-primary disabled:opacity-50"
                        >
                          {loading ? t("common.loading") : t("agentDashboard.subscribe")}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "requests" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">{t("agentDashboard.yourRequests")}</h3>
          {userRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">{t("agentDashboard.noRequests")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(userRequests as PopulatedRequest[]).map((req) => (
                <div key={req._id} className="card flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{req.tour.title}</p>
                    <p className="text-sm text-gray-600">
                      {req.tour.country} • {req.tour.price} грн
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("requests.status")}:
                      <span
                        className={`ml-1 px-2 py-1 rounded text-xs ${
                          req.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : req.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {t(`requests.status.${req.status}`)}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteRequest(req._id)}
                    disabled={requestsLoading}
                    className="btn bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    {requestsLoading ? t("common.loading") : t("agentDashboard.delete")}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AgentDashboard
