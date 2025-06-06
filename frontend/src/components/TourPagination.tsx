"use client"

import type React from "react"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { fetchTours, setPage } from "../features/tours/tourSlice"

const TourPagination: React.FC = () => {
  const dispatch = useAppDispatch()
  const { pagination, loading } = useAppSelector((state) => state.tours)

  const handlePageChange = async (newPage: number) => {
    if (newPage === pagination.page || loading) return

    dispatch(setPage(newPage))
    await dispatch(fetchTours({ page: newPage })).unwrap()
  }

  const renderPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    const startPage = Math.max(1, pagination.page - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1)

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            i === pagination.page ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          disabled={loading}
        >
          {i}
        </button>,
      )
    }

    return pages
  }

  if (pagination.totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <button
        onClick={() => handlePageChange(pagination.page - 1)}
        disabled={pagination.page === 1 || loading}
        className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
      >
        Previous
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => handlePageChange(pagination.page + 1)}
        disabled={pagination.page === pagination.totalPages || loading}
        className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>

      <span className="text-sm text-gray-600 ml-4">
        Page {pagination.page} of {pagination.totalPages} ({pagination.total} total tours)
      </span>
    </div>
  )
}

export default TourPagination
