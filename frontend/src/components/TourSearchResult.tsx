"use client"

import React from "react"
import { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useAppSelector } from "../store"
import { selectDisplayTours, selectUserRequests } from "../store/selectors"
import TourCard from "./TourCard"
import TourSearch from "./TourSearch"
import { Request } from "@/types"

const TourSearchResults: React.FC = React.memo(() => {
  const { t } = useTranslation()
  const displayTours = useAppSelector(selectDisplayTours)
  const userRequests = useAppSelector(selectUserRequests)
  const { searchLoading, searchResults } = useAppSelector((state) => state.tours)
  const user = useAppSelector((state) => state.auth.user)

  const [hasSearchResults, setHasSearchResults] = useState(false)

  const isSearchActive = hasSearchResults && searchResults.length > 0

  // Memoize loading skeleton to prevent re-creation
  const loadingSkeleton = useMemo(
    () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    ),
    [],
  )

  if (searchLoading) {
    return (
      <div className="space-y-6">
        <TourSearch onSearchResults={setHasSearchResults} />
        {loadingSkeleton}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TourSearch onSearchResults={setHasSearchResults} />

      {isSearchActive && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-green-900/30 dark:to-green-800/20 border-2 border-blue-200 dark:border-green-700 rounded-xl p-5 shadow-sm">
          <h4 className="font-bold text-blue-900 dark:text-green-300 mb-2 text-lg">{t("search.resultsTitle")}</h4>
          <p className="text-blue-700 dark:text-green-400 font-semibold">
            {displayTours.length > 0 ? t("search.resultsCount", { count: displayTours.length }) : t("search.noResults")}
          </p>
        </div>
      )}

      {displayTours.length === 0 && !searchLoading ? (
        <div className="text-center py-16 bg-white/60 dark:bg-gray-800/60 rounded-xl border-2 border-gray-200 dark:border-gray-700">
          <div className="text-6xl mb-6">🔍</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            {isSearchActive ? t("search.noResults") : t("tours.noTours")}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {isSearchActive ? t("search.tryDifferentFilters") : t("tours.noToursDescription")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTours.map((tour) => (
            <TourCard key={tour._id} tour={tour} userRequests={user?.role === "agent" ? userRequests : []} />
          ))}
        </div>
      )}
    </div>
  )
})

TourSearchResults.displayName = "TourSearchResults"

export default TourSearchResults
