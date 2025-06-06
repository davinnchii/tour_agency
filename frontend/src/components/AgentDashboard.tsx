"use client"

import { useState, useMemo, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "../store"
import { addSubscription, removeSubscription } from "../features/subscriptions/subscriptionSlice"
import { removeRequest } from "@/features/requests/requestsSlice"
import { toastSuccess, toastError } from "../utils/toast"
import { useAppData, useLazyData } from "../hooks"
import { selectUserRequests, selectUserSubscriptions, selectUsers } from "../store/selectors"
import TourSearchResults from "./TourSearchResult"
import type { User, PopulatedRequest } from "../types"
import React from "react"

const AgentDashboard: React.FC = React.memo(() => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { loadRequests } = useLazyData()

  // Use memoized selectors
  const user = useAppSelector((state) => state.auth.user)
  const userRequests = useAppSelector(selectUserRequests)
  const userSubscriptions = useAppSelector(selectUserSubscriptions)
  const { operators, loading: usersLoading } = useAppSelector(selectUsers)

  const [activeTab, setActiveTab] = useState<"tours" | "operators" | "requests">("tours")
  const [actionLoading, setActionLoading] = useState(false)

  // Initialize app data
  useAppData()

  // Memoized subscription status map for better performance
  const subscriptionMap = useMemo(() => {
    const map = new Map<string, boolean>()
    userSubscriptions.forEach((sub) => {
      if (sub.operator?._id) {
        map.set(sub.operator._id, true)
      }
    })
    return map
  }, [userSubscriptions])

  const handleSubscribe = useCallback(
    async (operator: User) => {
      if (!user || actionLoading) return

      const data = {
        agency: user._id,
        operatorId: operator._id,
      }

      try {
        setActionLoading(true)
        await dispatch(addSubscription(data)).unwrap()
        toastSuccess(t("agentDashboard.subscriptionCreated"))
      } catch (err) {
        console.error(err)
        toastError(t("agentDashboard.subscriptionCreateErrorAlert"))
      } finally {
        setActionLoading(false)
      }
    },
    [user, actionLoading, dispatch, t],
  )

  const handleDeleteSubscription = useCallback(
    async (subscriptionId: string) => {
      if (actionLoading) return

      try {
        setActionLoading(true)
        await dispatch(removeSubscription(subscriptionId)).unwrap()
        toastSuccess(t("agentDashboard.subscriptionDeleted"))
      } catch (err) {
        console.error(err)
        toastError(t("agentDashboard.subscriptionDeleteError"))
      } finally {
        setActionLoading(false)
      }
    },
    [actionLoading, dispatch, t],
  )

  const handleDeleteRequest = useCallback(
    async (id: string) => {
      try {
        await dispatch(removeRequest(id)).unwrap()
        toastSuccess(t("agentDashboard.requestDeleted"))
      } catch (err) {
        console.error(err)
        toastError(t("agentDashboard.requestDeleteError"))
      }
    },
    [dispatch, t],
  )

  const handleRequestsTabClick = useCallback(async () => {
    setActiveTab("requests")
    // Lazy load requests only when needed
    await loadRequests()
  }, [loadRequests])

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
            onClick={handleRequestsTabClick}
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
      {activeTab === "tours" && <TourSearchResults />}

      {activeTab === "operators" && (
        <OperatorsList
          operators={operators}
          loading={usersLoading}
          subscriptionMap={subscriptionMap}
          userSubscriptions={userSubscriptions}
          actionLoading={actionLoading}
          onSubscribe={handleSubscribe}
          onUnsubscribe={handleDeleteSubscription}
        />
      )}

      {activeTab === "requests" && (
        <RequestsList requests={userRequests as PopulatedRequest[]} onDeleteRequest={handleDeleteRequest} />
      )}
    </div>
  )
})

// Memoized sub-components to prevent unnecessary re-renders
const OperatorsList = React.memo<{
  operators: User[]
  loading: boolean
  subscriptionMap: Map<string, boolean>
  userSubscriptions: any[]
  actionLoading: boolean
  onSubscribe: (operator: User) => void
  onUnsubscribe: (subscriptionId: string) => void
}>(({ operators, loading, subscriptionMap, userSubscriptions, actionLoading, onSubscribe, onUnsubscribe }) => {
  const { t } = useTranslation()

  if (loading) {
    return <p>{t("agentDashboard.loading")}</p>
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{t("agentDashboard.operatorList")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {operators.map((operator) => {
          const isSubscribed = subscriptionMap.get(operator._id) || false
          const subscription = userSubscriptions.find((sub) => sub.operator?._id === operator._id)

          return (
            <div key={operator._id} className="card flex justify-between items-center">
              <div>
                <h4 className="font-bold text-lg">{operator.name}</h4>
                <p className="text-sm text-gray-600">{operator.email}</p>
              </div>
              <div>
                {isSubscribed ? (
                  <button
                    onClick={() => subscription && onUnsubscribe(subscription._id)}
                    disabled={actionLoading}
                    className="btn bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    {actionLoading ? t("common.loading") : t("agentDashboard.unsubscribe")}
                  </button>
                ) : (
                  <button
                    onClick={() => onSubscribe(operator)}
                    disabled={actionLoading}
                    className="btn btn-primary disabled:opacity-50"
                  >
                    {actionLoading ? t("common.loading") : t("agentDashboard.subscribe")}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})

const RequestsList = React.memo<{
  requests: PopulatedRequest[]
  onDeleteRequest: (id: string) => void
}>(({ requests, onDeleteRequest }) => {
  const { t } = useTranslation()

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{t("agentDashboard.yourRequests")}</h3>
      {requests.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">{t("agentDashboard.noRequests")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
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
              <button onClick={() => onDeleteRequest(req._id)} className="btn bg-red-500 text-white hover:bg-red-600">
                {t("agentDashboard.delete")}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
})

AgentDashboard.displayName = "AgentDashboard"
OperatorsList.displayName = "OperatorsList"
RequestsList.displayName = "RequestsList"

export default AgentDashboard
