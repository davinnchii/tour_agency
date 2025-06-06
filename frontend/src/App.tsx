"use client"

import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Provider } from "react-redux"
import { ToastContainer } from "react-toastify"
import { store } from "@/store"
import ProtectedRoute from "./components/ProtectedRoute"
import DashboardLayout from "@/pages/DashboardPage"
import LoginPage from "@/pages/LoginPage"
import RegisterPage from "@/pages/RegisterPage"

// Import react-toastify CSS
import "react-toastify/dist/ReactToastify.css"

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        {/* Toast Container for notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/operator"
            element={
              <ProtectedRoute requiredRole="operator">
                <DashboardLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent"
            element={
              <ProtectedRoute requiredRole="agent">
                <DashboardLayout />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
