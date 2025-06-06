"use client"

import type React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, Link } from "react-router-dom"
import { useAppDispatch } from "@/app/store"
import { registerAsync } from "../features/auth/authSlice"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import type { RegisterPayload } from "../types"

const RegisterPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [formData, setFormData] = useState<RegisterPayload>({
    name: "",
    email: "",
    password: "",
    role: "agent",
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== confirmPassword) {
      setError(t("auth.passwordMismatch"))
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError(t("auth.passwordTooShort"))
      setLoading(false)
      return
    }

    try {
      const response = formData;
      dispatch(registerAsync(response))
      navigate("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof RegisterPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{error}</div>
          )}

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
                onChange={(e) => setConfirmPassword(e.target.value)}
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
