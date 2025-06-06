"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { registerAsync, clearError } from "../features/auth/authSlice"
import { toastError } from "../utils/toast"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import type { RegisterPayload } from "../types"

const RegisterPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState<RegisterPayload>({
    name: "",
    email: "",
    password: "",
    role: "agent",
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  const [validationError, setValidationError] = useState("")

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError())
  }, [dispatch])

  useEffect(() => {
    // Show toast for errors
    if (error) {
      toastError(error)
    }
    if (validationError) {
      toastError(validationError)
    }
  }, [error, validationError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(clearError())
    setValidationError("")

    if (formData.password !== confirmPassword) {
      setValidationError(t("auth.passwordMismatch"))
      return
    }

    if (formData.password.length < 6) {
      setValidationError(t("auth.passwordTooShort"))
      return
    }

    try {
      await dispatch(registerAsync(formData)).unwrap()
      // Navigation will happen via useEffect when isAuthenticated changes
    } catch (err) {
      // Error is handled by the rejected case in the slice
      console.error("Registration failed:", err)
    }
  }

  const handleInputChange = (field: keyof RegisterPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear errors when user starts typing
    if (error) {
      dispatch(clearError())
    }
    if (validationError) {
      setValidationError("")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <LanguageSwitcher />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{t("auth.register")}</h2>
          <p className="mt-2 text-sm text-gray-600">{t("auth.registerSubtitle")}</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="field">
              <label htmlFor="name">{t("auth.name")}</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={t("auth.namePlaceholder")}
                required
                disabled={loading}
              />
            </div>

            <div className="field">
              <label htmlFor="email">{t("auth.email")}</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="user@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="field">
              <label htmlFor="role">{t("auth.role")}</label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value as "agent" | "operator")}
                className="input"
                disabled={loading}
              >
                <option value="agent">{t("auth.roles.agent")}</option>
                <option value="operator">{t("auth.roles.operator")}</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="password">{t("auth.password")}</label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder={t("auth.passwordPlaceholder")}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <div className="field">
              <label htmlFor="confirmPassword">{t("auth.confirmPassword")}</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (validationError) setValidationError("")
                }}
                placeholder={t("auth.confirmPasswordPlaceholder")}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? t("common.loading") : t("auth.register")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t("auth.hasAccount")}{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                {t("auth.login")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
