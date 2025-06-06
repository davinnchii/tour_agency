"use client";

import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "@/store";
import { loginAsync } from "../features/auth/authSlice";
import { login } from "../api/authService";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const credentials = formData;
      await dispatch(loginAsync(credentials)).unwrap();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <LanguageSwitcher />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {t("auth.login")}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t("auth.loginSubtitle")}
          </p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="field">
              <label htmlFor="email">{t("auth.email")}</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="agent@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="field">
              <label htmlFor="password">{t("auth.password")}</label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? t("common.loading") : t("auth.login")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t("auth.noAccount")}{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                {t("auth.register")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
