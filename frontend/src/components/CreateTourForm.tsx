"use client"

import type React from "react"
import * as yup from "yup"
import { useYupValidationResolver } from "../hooks/useYupValidationResolver"
import { Controller, useForm } from "react-hook-form"
import { addTour } from "../features/tours/tourSlice"
import Select from "react-select"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { toastSuccess, toastError } from "../utils/toast"
import type { CreateTourPayload, User } from "../types"

interface CountryOption {
  value: string
  label: string
}

const countryOptions: CountryOption[] = [
  { value: "Україна", label: "Україна" },
  { value: "Польща", label: "Польща" },
  { value: "Італія", label: "Італія" },
  { value: "Іспанія", label: "Іспанія" },
  { value: "Єгипет", label: "Єгипет" },
  { value: "Туреччина", label: "Туреччина" },
]

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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">{t("createTourForm.title")}</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder={t("createTourForm.placeholders.title")}
              {...register("title")}
              className="w-full border p-2 rounded"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          <div>
            <textarea
              placeholder={t("createTourForm.placeholders.description")}
              {...register("description")}
              className="w-full border p-2 rounded"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          <div>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <Select {...field} options={countryOptions} placeholder={t("createTourForm.placeholders.country")} />
              )}
            />
            {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
          </div>

          <div>
            <input
              type="number"
              placeholder={t("createTourForm.placeholders.price")}
              {...register("price")}
              className="w-full border p-2 rounded"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>

          <div>
            <input type="date" {...register("startDate")} className="w-full border p-2 rounded" />
            {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
          </div>

          <div>
            <input type="date" {...register("endDate")} className="w-full border p-2 rounded" />
            {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
          </div>

          <div className="flex justify-between pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? t("common.loading") : t("createTourForm.buttons.create")}
            </button>
            <button type="button" className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" onClick={onClose}>
              {t("createTourForm.buttons.cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
