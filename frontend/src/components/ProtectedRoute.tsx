"use client"

import type React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "agent" | "operator"
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
