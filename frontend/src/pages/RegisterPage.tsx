"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/store"
import { registerAsync, clearError } from "../features/auth/authSlice"
import { toastError } from "../utils/toast"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import ThemeToggle from "@/components/ThemeToggle"
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10 animate-fade-in">
        <div className="text-center">
          <div className="flex justify-center items-center gap-3 mb-6">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          <h2 className="text-4xl font-extrabold text-white dark:text-gray-100 mb-2 drop-shadow-lg">{t("auth.register")}</h2>
          <p className="mt-2 text-lg text-white/90 dark:text-gray-300 font-medium">{t("auth.registerSubtitle")}</p>
        </div>

        <div className="glass rounded-2xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="field">
              <label htmlFor="name" className="text-gray-700">{t("auth.name")}</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={t("auth.namePlaceholder")}
                required
                disabled={loading}
                className="input"
              />
            </div>

            <div className="field">
              <label htmlFor="email" className="text-gray-700">{t("auth.email")}</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="user@example.com"
                required
                disabled={loading}
                className="input"
              />
            </div>

            <div className="field">
              <label htmlFor="role" className="text-gray-700">{t("auth.role")}</label>
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
              <label htmlFor="password" className="text-gray-700">{t("auth.password")}</label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder={t("auth.passwordPlaceholder")}
                required
                disabled={loading}
                minLength={6}
                className="input"
              />
            </div>

            <div className="field">
              <label htmlFor="confirmPassword" className="text-gray-700">{t("auth.confirmPassword")}</label>
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
                className="input"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full text-lg py-3.5">
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                  {t("common.loading")}
                </span>
              ) : (
                t("auth.register")
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("auth.hasAccount")}{" "}
              <Link to="/login" className="text-blue-600 dark:text-green-400 hover:text-blue-700 dark:hover:text-green-300 font-semibold transition-colors underline-offset-2 hover:underline">
                {t("auth.login")}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default RegisterPage
