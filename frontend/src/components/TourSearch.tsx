"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { searchToursAsync, clearSearchResults } from "../features/tours/tourSlice"
import type { TourSearchParams } from "../types"

interface TourSearchProps {
  onSearchResults?: (hasResults: boolean) => void
}

const TourSearch: React.FC<TourSearchProps> = ({ onSearchResults }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { searchResults, searchLoading, searchPagination } = useAppSelector((state) => state.tours)
  const user = useAppSelector((state) => state.auth.user)

  const [searchParams, setSearchParams] = useState<TourSearchParams>({
    search: "",
    country: "",
    minPrice: undefined,
    maxPrice: undefined,
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
    sortBy: "title",
    sortOrder: "asc",
  })

  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isSearchActive, setIsSearchActive] = useState(false)

  const countries = [
    "Україна",
    "Польща",
    "Італія",
    "Іспанія",
    "Єгипет",
    "Туреччина",
    "Франція",
    "Німеччина",
    "Греція",
    "Туніс",
  ]

  const sortOptions = [
    { value: "title", label: t("search.sort.title") },
    { value: "price", label: t("search.sort.price") },
    { value: "country", label: t("search.sort.country") },
    { value: "startDate", label: t("search.sort.startDate") },
  ]

  useEffect(() => {
    onSearchResults?.(searchResults.length > 0)
  }, [searchResults, onSearchResults])

  const handleSearch = async (resetPage = true) => {
    const filteredParams: TourSearchParams = Object.entries(searchParams).reduce((acc, [key, value]) => {
      if (value !== "" && value !== undefined && value !== null) {
        acc[key as keyof TourSearchParams] = value
      }
      return acc
    }, {} as TourSearchParams)

    if (resetPage) {
      filteredParams.page = 1
      setSearchParams((prev) => ({ ...prev, page: 1 }))
    }

    try {
      await dispatch(searchToursAsync(filteredParams)).unwrap()
      setIsSearchActive(true)
    } catch (error) {
      console.error("Search failed:", error)
    }
  }

  const handleClearSearch = () => {
    setSearchParams({
      search: "",
      country: "",
      minPrice: undefined,
      maxPrice: undefined,
      startDate: "",
      endDate: "",
      page: 1,
      limit: 10,
      sortBy: "title",
      sortOrder: "asc",
    })
    dispatch(clearSearchResults())
    setIsSearchActive(false)
    setShowAdvanced(false)
  }

  const handleInputChange = (field: keyof TourSearchParams, value: string | number | undefined) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => ({ ...prev, page: newPage }))
    handleSearch(false)
  }

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{t("search.title")}</h3>
        <div className="flex items-center gap-2">
          {isSearchActive && (
            <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
              {t("search.activeSearch", { count: searchResults.length })}
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showAdvanced ? t("search.hideAdvanced") : t("search.showAdvanced")}
          </button>
        </div>
      </div>

      {/* Quick Search */}
      <form onSubmit={handleQuickSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={t("search.placeholders.quickSearch")}
            value={searchParams.search || ""}
            onChange={(e) => handleInputChange("search", e.target.value)}
            className="input flex-1"
          />
          <button type="submit" disabled={searchLoading} className="btn btn-primary px-6">
            {searchLoading ? t("common.searching") : t("search.search")}
          </button>
        </div>
      </form>

      {/* Advanced Search */}
      {showAdvanced && (
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Country Filter */}
            <div className="field">
              <label>{t("search.filters.country")}</label>
              <select
                value={searchParams.country || ""}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className="input"
              >
                <option value="">{t("search.filters.allCountries")}</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="field">
              <label>{t("search.filters.minPrice")}</label>
              <input
                type="number"
                placeholder="0"
                value={searchParams.minPrice || ""}
                onChange={(e) => handleInputChange("minPrice", e.target.value ? Number(e.target.value) : undefined)}
                className="input"
                min="0"
              />
            </div>

            <div className="field">
              <label>{t("search.filters.maxPrice")}</label>
              <input
                type="number"
                placeholder="999999"
                value={searchParams.maxPrice || ""}
                onChange={(e) => handleInputChange("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
                className="input"
                min="0"
              />
            </div>

            {/* Date Range */}
            <div className="field">
              <label>{t("search.filters.startDate")}</label>
              <input
                type="date"
                value={searchParams.startDate || ""}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className="input"
              />
            </div>

            <div className="field">
              <label>{t("search.filters.endDate")}</label>
              <input
                type="date"
                value={searchParams.endDate || ""}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className="input"
              />
            </div>

            {/* Sort Options */}
            <div className="field">
              <label>{t("search.filters.sortBy")}</label>
              <div className="flex gap-2">
                <select
                  value={searchParams.sortBy || "title"}
                  onChange={(e) => handleInputChange("sortBy", e.target.value as any)}
                  className="input flex-1"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  value={searchParams.sortOrder || "asc"}
                  onChange={(e) => handleInputChange("sortOrder", e.target.value as "asc" | "desc")}
                  className="input w-24"
                >
                  <option value="asc">{t("search.sort.asc")}</option>
                  <option value="desc">{t("search.sort.desc")}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search Actions */}
          <div className="flex gap-3">
            <button type="button" onClick={() => handleSearch()} disabled={searchLoading} className="btn btn-primary">
              {searchLoading ? t("common.searching") : t("search.applyFilters")}
            </button>
            <button type="button" onClick={handleClearSearch} className="btn btn-secondary">
              {t("search.clearFilters")}
            </button>
          </div>
        </div>
      )}

      {/* Search Results Summary */}
      {isSearchActive && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {t("search.resultsFound", {
                count: searchPagination.total,
                page: searchPagination.page,
                totalPages: searchPagination.totalPages,
              })}
            </span>
            {searchPagination.totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(searchPagination.page - 1)}
                  disabled={searchPagination.page === 1 || searchLoading}
                  className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                >
                  ←
                </button>
                <span>
                  {searchPagination.page} / {searchPagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(searchPagination.page + 1)}
                  disabled={searchPagination.page === searchPagination.totalPages || searchLoading}
                  className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TourSearch
