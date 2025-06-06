"use client"

import type React from "react"
import { useTranslation } from "react-i18next"
import { useAppSelector } from "@/app/store"
import TourCard from "./TourCard"
import TourSearch from "./TourSearch"
import { useState } from "react"

const TourSearchResults: React.FC = () => {
  const { t } = useTranslation()
  const { searchResults, searchLoading, tours } = useAppSelector((state) => state.tours)
  const [hasSearchResults, setHasSearchResults] = useState(false)

  const displayTours = hasSearchResults ? searchResults : tours
  const isSearchActive = hasSearchResults

  if (searchLoading) {
    return (
      <div className="space-y-6">
        <TourSearch onSearchResults={setHasSearchResults} />
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TourSearch onSearchResults={setHasSearchResults} />

      {isSearchActive && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-1">{t("search.resultsTitle")}</h4>
          <p className="text-blue-700 text-sm">
            {displayTours.length > 0 ? t("search.resultsCount", { count: displayTours.length }) : t("search.noResults")}
          </p>
        </div>
      )}

      {displayTours.length === 0 && !searchLoading ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isSearchActive ? t("search.noResults") : t("tours.noTours")}
          </h3>
          <p className="text-gray-600">
            {isSearchActive ? t("search.tryDifferentFilters") : t("tours.noToursDescription")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTours.map((tour) => (
            <TourCard variant="compact" key={tour._id} tour={tour} />
          ))}
        </div>
      )}
    </div>
  )
}

export default TourSearchResults
