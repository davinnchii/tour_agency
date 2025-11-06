"use client"

import React from "react"
import { useAuth } from "../hooks/useAuth"
import { useTranslation } from "react-i18next"
import OperatorDashboard from "@/components/OperatorDashboard"
import AgentDashboard from "@/components/AgentDashboard"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import ThemeToggle from "@/components/ThemeToggle"

const DashboardLayout: React.FC = React.memo(() => {
  const { user, isOperator, isAgent, logout } = useAuth()
  const { t } = useTranslation()

  if (!user) {
    return <div>{t("common.loading")}</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div>
              <h1 className="text-2xl font-bold gradient-text">{t("auth.welcome", { name: user.name })}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {t("dashboard.role")}: <span className="font-semibold text-blue-600 dark:text-green-400 capitalize">{user.role}</span>
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <LanguageSwitcher />
              <button
                onClick={logout}
                className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white px-6 py-2.5 rounded-lg hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg font-semibold transform hover:-translate-y-0.5"
              >
                {t("auth.logout")}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {isOperator && <OperatorDashboard />}
        {isAgent && <AgentDashboard />}
      </main>
    </div>
  )
})

DashboardLayout.displayName = "DashboardLayout"

export default DashboardLayout
