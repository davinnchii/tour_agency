"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { fetchTours } from "../features/tours/tourSlice"
import { fetchSubscriptions, addSubscription, removeSubscription } from "../features/subscriptions/subscriptionSlice"
import { fetchRequests, removeRequest } from "@/features/requests/requestsSlice"
import { getOperators } from "../features/users/userSlice"

import type { User, Subscription, PopulatedRequest, Request } from "@/types"
import TourSearchResults from "./TourSearchResult"

const AgentDashboard: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const user = useAppSelector((state) => state.auth.user)
  const { operators, loading } = useAppSelector((state) => state.users)
  const subscriptions = useAppSelector((state) => state.subscriptions.subscriptions) as Subscription[]
  const { requests, loaded } = useAppSelector((state) => state.requests)

  const [activeTab, setActiveTab] = useState<"tours" | "operators" | "requests">("tours")  

  const userRequests = requests.filter(req => {
    return req.agency == user?._id
});

  useEffect(() => {
    dispatch(getOperators()).unwrap()
    dispatch(fetchTours()).unwrap()
    dispatch(fetchSubscriptions()).unwrap()
    dispatch(fetchRequests()).unwrap()
  }, [dispatch])

  const handleSubscribe = async (operator: User): Promise<void> => {
    if (!user) return

    const data = {
      agency: user._id,
      operator: operator._id,
    }

    try {
      await dispatch(addSubscription(data)).unwrap()
      await dispatch(fetchSubscriptions()).unwrap()
      alert(t("agentDashboard.subscriptionCreated"))
    } catch (err) {
      console.error(t("agentDashboard.subscriptionCreateError"), err)
      alert(t("agentDashboard.subscriptionCreateErrorAlert"))
    }
  }

  const handleDeleteSubscription = async (id: string): Promise<void> => {
    try {
      await dispatch(removeSubscription(id)).unwrap()
      await dispatch(fetchSubscriptions()).unwrap()
      alert(t("agentDashboard.subscriptionDeleted"))
    } catch (err) {
      console.error(t("agentDashboard.subscriptionDeleteError"), err)
    }
  }

  const handleDeleteRequest = async (id: string): Promise<void> => {
    try {
      await dispatch(removeRequest(id)).unwrap()
      await dispatch(fetchRequests()).unwrap()
      alert(t("agentDashboard.requestDeleted"))
    } catch (err) {
      console.error(err)
      alert(t("agentDashboard.requestDeleteError"))
    }
  }

  const handleFetchRequests = async (): Promise<void> => {
    if (!loaded) {
      try {
        await dispatch(fetchRequests()).unwrap()
      } catch (err) {
        console.error(err)
      }
    }
  }

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
            {t("agentDashboard.myRequests")}
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "tours" && <TourSearchResults userRequests={userRequests}  />}

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
                          className="btn bg-red-500 text-white hover:bg-red-600"
                        >
                          {t("agentDashboard.unsubscribe")}
                        </button>
                      ) : (
                        <button onClick={() => handleSubscribe(op)} className="btn btn-primary">
                          {t("agentDashboard.subscribe")}
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
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">{t("agentDashboard.noRequests")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(requests as Request[]).map((req) => (
                <div key={req._id} className="card flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{req.tour.title}</p>
                    <p className="text-sm text-gray-600">
                      {req.tour.country} • {req.tour.price} грн
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("requests.status")}: {t(`requests.status.${req.status}`)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteRequest(req._id)}
                    className="btn bg-red-500 text-white hover:bg-red-600"
                  >
                    {t("agentDashboard.delete")}
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
