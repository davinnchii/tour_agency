"use client"

import type React from "react"
import * as yup from "yup"
import { useYupValidationResolver } from "../hooks/useYupValidationResolver"
import { Controller, useForm } from "react-hook-form"
import { addTour } from "../features/tours/tourSlice"
import Select from "react-select"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "@/store"
import { toastSuccess, toastError } from "../utils/toast"
import type { CreateTourPayload, User } from "../types"

interface CountryOption {
  value: string
  label: string
}

interface FormData {
  title: string
  description: string
  country: CountryOption
  price: number
  startDate: string // HTML date input returns string
  endDate: string // HTML date input returns string
}

interface CreateTourFormProps {
  onClose: () => void
}

export const CreateTourForm: React.FC<CreateTourFormProps> = ({ onClose }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const { loading } = useAppSelector((state) => state.tours)

  const countryOptions: CountryOption[] = [
    { value: "Ukraine", label: t("countries.ukraine") },
    { value: "Poland", label: t("countries.poland") },
    { value: "Italy", label: t("countries.italy") },
    { value: "Spain", label: t("countries.spain") },
    { value: "Egypt", label: t("countries.egypt") },
    { value: "Turkey", label: t("countries.turkey") },
    { value: "France", label: t("countries.france") },
    { value: "Germany", label: t("countries.germany") },
    { value: "Greece", label: t("countries.greece") },
    { value: "Tunisia", label: t("countries.tunisia") },
  ]

  const schema = yup.object().shape({
    title: yup.string().required(t("createTourForm.errors.titleRequired")).max(100),
    description: yup.string().required(t("createTourForm.errors.descriptionRequired")).max(512),
    country: yup.object().required(t("createTourForm.errors.countryRequired")),
    price: yup.number().required(t("createTourForm.errors.priceRequired")).min(1),
    startDate: yup
      .string()
      .required(t("createTourForm.errors.startDateRequired"))
      .test("is-future", t("createTourForm.errors.startDateMin"), (value) => {
        if (!value) return false
        return new Date(value) >= new Date()
      }),
    endDate: yup
      .string()
      .required(t("createTourForm.errors.endDateRequired"))
      .test("is-after-start", t("createTourForm.errors.endDateMin"), function (value) {
        const { startDate } = this.parent
        if (!value || !startDate) return false
        return new Date(value) > new Date(startDate)
      }),
  })

  const resolver = useYupValidationResolver(schema)

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver })

  const onSubmit = async (data: FormData): Promise<void> => {
    if (!user) {
      toastError(t("createTourForm.userNotFound"))
      return
    }

    // Convert form data to API payload
    const payload: CreateTourPayload = {
      title: data.title,
      description: data.description,
      country: data.country.value,
      price: Number(data.price),
      startDate: data.startDate, // Already a string from HTML input
      endDate: data.endDate, // Already a string from HTML input
      operator: user as User, // Use 'id' to match backend format
    }

    try {
      await dispatch(addTour(payload)).unwrap()
      toastSuccess(t("createTourForm.success"))
      reset()
      onClose()
    } catch (err) {
      console.error(err)
      toastError(t("createTourForm.error"))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-lg border-2 border-gray-200 dark:border-gray-700 animate-slide-in">
        <h3 className="text-2xl font-bold mb-6 gradient-text">{t("createTourForm.title")}</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="field">
            <label className="text-gray-700">{t("createTourForm.placeholders.title")}</label>
            <input
              type="text"
              placeholder={t("createTourForm.placeholders.title")}
              {...register("title")}
              className="input"
            />
            {errors.title && <p className="error">{errors.title.message}</p>}
          </div>

          <div className="field">
            <label className="text-gray-700">{t("createTourForm.placeholders.description")}</label>
            <textarea
              placeholder={t("createTourForm.placeholders.description")}
              {...register("description")}
              className="input min-h-[100px] resize-y"
              rows={4}
            />
            {errors.description && <p className="error">{errors.description.message}</p>}
          </div>

          <div className="field">
            <label className="text-gray-700">{t("createTourForm.placeholders.country")}</label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select 
                  {...field} 
                  options={countryOptions} 
                  placeholder={t("createTourForm.placeholders.country")}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              )}
            />
            {errors.country && <p className="error">{errors.country.message}</p>}
          </div>

          <div className="field">
            <label className="text-gray-700">{t("createTourForm.placeholders.price")}</label>
            <input
              type="number"
              placeholder={t("createTourForm.placeholders.price")}
              {...register("price")}
              className="input"
            />
            {errors.price && <p className="error">{errors.price.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="field">
              <label className="text-gray-700">{t("createTourForm.placeholders.startDate") || "Start Date"}</label>
              <input type="date" {...register("startDate")} className="input" />
              {errors.startDate && <p className="error">{errors.startDate.message}</p>}
            </div>

            <div className="field">
              <label className="text-gray-700">{t("createTourForm.placeholders.endDate") || "End Date"}</label>
              <input type="date" {...register("endDate")} className="input" />
              {errors.endDate && <p className="error">{errors.endDate.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              className="btn btn-secondary px-6" 
              onClick={onClose}
            >
              {t("createTourForm.buttons.cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 px-6 shadow-md"
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                  {t("common.loading")}
                </span>
              ) : (
                t("createTourForm.buttons.create")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
