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
            {t("agentDashboard.searchTours")}
          </button>
          <button
            onClick={() => setActiveTab("operators")}
            className={`py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-200 ${
              activeTab === "operators"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 dark:from-green-500 dark:to-green-600 text-white shadow-lg transform scale-105"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {t("agentDashboard.operators")}
          </button>
          <button
            onClick={handleRequestsTabClick}
            className={`py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-200 relative ${
              activeTab === "requests"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 dark:from-green-500 dark:to-green-600 text-white shadow-lg transform scale-105"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {t("agentDashboard.myRequests")}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === "requests" ? "bg-white/30" : "bg-blue-100 dark:bg-green-900/50 text-blue-700 dark:text-green-300"
            }`}>
              {userRequests.length}
            </span>
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
            <div key={operator._id} className="card flex justify-between items-center bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-gray-900/50 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-green-500 transition-all duration-300">
              <div>
                <h4 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-1">{operator.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{operator.email}</p>
              </div>
              <div>
                {isSubscribed ? (
                  <button
                    onClick={() => subscription && onUnsubscribe(subscription._id)}
                    disabled={actionLoading}
                    className="btn bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 disabled:opacity-50 shadow-md"
                  >
                    {actionLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        {t("common.loading")}
                      </span>
                    ) : (
                      t("agentDashboard.unsubscribe")
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => onSubscribe(operator)}
                    disabled={actionLoading}
                    className="btn btn-primary disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        {t("common.loading")}
                      </span>
                    ) : (
                      t("agentDashboard.subscribe")
                    )}
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
          <p className="text-gray-600 dark:text-gray-400">{t("agentDashboard.noRequests")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req._id} className="card flex justify-between items-center bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-900/50 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-green-500 transition-all duration-300">
              <div className="flex-1">
                <p className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">{req.tour.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">
                  {req.tour.country} • <span className="font-bold text-blue-600 dark:text-green-400">{req.tour.price} грн</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                  {t("requests.status")}:
                  <span
                    className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${
                      req.status === "pending"
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
                        : req.status === "approved"
                          ? "bg-gradient-to-r from-green-400 to-green-500 text-white"
                          : "bg-gradient-to-r from-red-400 to-red-500 text-white"
                    }`}
                  >
                    {t(`requests.status.${req.status}`)}
                  </span>
                </p>
              </div>
              <button 
                onClick={() => onDeleteRequest(req._id)} 
                className="btn bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md ml-4"
              >
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
