"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { removeTour, fetchTours } from "../features/tours/tourSlice"
import { fetchRequests, removeRequest } from "@/features/requests/requestsSlice"
import { CreateTourForm } from "./CreateTourForm"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "@/app/store"
import type { Request, Tour } from "@/types"

const OperatorDashboard: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const tours = useAppSelector((state) => state.tours.tours) as Tour[]
  const { requests, loaded } = useAppSelector((state) => state.requests)
  const user = useAppSelector((state) => state.auth.user)

  const [showRequests, setShowRequests] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)

  useEffect(() => {
    dispatch(fetchTours()).unwrap()
  }, [dispatch])

  const handleDeleteTour = async (tourId: string): Promise<void> => {
    if (!tourId) return

    try {
      await dispatch(removeTour(tourId)).unwrap()
      alert(t("operatorDashboard.tourDeleted"))
    } catch (err) {
      console.error(err)
      alert(t("operatorDashboard.tourDeleteError"))
    }
  }

  const handleFetchRequests = async (): Promise<void> => {
    if (showRequests) {
      setShowRequests(false)
      return
    }

    if (!loaded) {
      try {
        await dispatch(fetchRequests()).unwrap()
      } catch (err) {
        console.error(t("operatorDashboard.requestsLoadError"), err)
      }
    }

    setShowRequests(true)
  }

  const handleDeleteRequest = async (id: string): Promise<void> => {
    try {
      await dispatch(removeRequest(id)).unwrap()
      await dispatch(fetchRequests()).unwrap()
      alert(t("operatorDashboard.requestDeleted"))
    } catch (err) {
      console.error(err)
      alert(t("operatorDashboard.requestDeleteError"))
    }
  }

  const handleCloseModal = async (): Promise<void> => {
    await dispatch(fetchTours()).unwrap()
    setShowModal(!showModal)
  }

  console.log(tours, user);


  const operatorRequests = useMemo(() => {
    if (!user) return []
    return (requests as Request[]).filter((req) => req.tour?.operator?._id === user._id)
  }, [requests, user])

  if (!user) {
    return <div>{t("common.loading")}</div>
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t("operatorDashboard.dashboardTitle")}</h2>

      <div className="space-y-3 mb-6">
        <button
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
          onClick={() => setShowModal(true)}
        >
          {t("operatorDashboard.createTour")}
        </button>
        <button
          className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition"
          onClick={handleFetchRequests}
        >
          {showRequests ? t("operatorDashboard.hideRequests") : t("operatorDashboard.showRequests")}
        </button>
      </div>
      {showModal && <CreateTourForm onClose={handleCloseModal} />}

      {/* Tour Overview */}
      {tours.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">{t("operatorDashboard.yourTours")}</h3>
          <ul className="space-y-2">
            {tours
              .filter((tour) => tour.operator._id === user.id)
              .map((tour) => (
                <li key={tour._id} className="border p-3 rounded flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{tour.title}</p>
                    <p className="text-sm text-gray-600">
                      {tour.country}, {tour.price} грн
                    </p>
                  </div>
                  <button
                    className="px-4 bg-red-500 text-white py-1 rounded hover:bg-red-600 transition"
                    onClick={() => handleDeleteTour(tour._id)}
                  >
                    {t("operatorDashboard.deleteTour")}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Tour Requests */}
      {showRequests && (
        <div>
          <h3 className="text-lg font-bold mb-2">{t("operatorDashboard.requestsOnTours")}</h3>
          {operatorRequests.length === 0 ? (
            <p>{t("operatorDashboard.noRequests")}</p>
          ) : (
            <ul className="space-y-2">
              {operatorRequests.map((req) => (
                <li key={req._id} className="border p-3 rounded flex justify-between items-center">
                  <div>
                    <p>
                      <strong>{t("operatorDashboard.client")}:</strong> {req.customerName}
                    </p>
                    <p>
                      <strong>{t("operatorDashboard.tour")}:</strong> {req.tour.title} ({req.tour.country})
                    </p>
                    <p>
                      <strong>{t("operatorDashboard.email")}:</strong> {req.customerEmail}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteRequest(req._id)}
                    className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    {t("operatorDashboard.delete")}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default OperatorDashboard
