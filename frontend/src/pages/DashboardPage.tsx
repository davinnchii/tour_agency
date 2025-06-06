"use client"

import React from "react"
import { useAuth } from "../hooks/useAuth"
import { useTranslation } from "react-i18next"
import OperatorDashboard from "@/components/OperatorDashboard"
import AgentDashboard from "@/components/AgentDashboard"
import LanguageSwitcher from "@/components/LanguageSwitcher"

const DashboardLayout: React.FC = React.memo(() => {
  const { user, isOperator, isAgent, logout } = useAuth()
  const { t } = useTranslation()

  if (!user) {
    return <div>{t("common.loading")}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold">{t("auth.welcome", { name: user.name })}</h1>
              <p className="text-sm text-gray-600">
                {t("dashboard.role")}: <span className="font-medium">{user.role}</span>
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                {t("auth.logout")}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {isOperator && <OperatorDashboard />}
        {isAgent && <AgentDashboard />}
      </main>
    </div>
  )
})

DashboardLayout.displayName = "DashboardLayout"

export default DashboardLayout
