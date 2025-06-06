import type React from "react"
import { toast, type ToastOptions } from "react-toastify"

// Default toast configuration
const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
}

// Toast utility functions with consistent styling and behavior
export const toastSuccess = (message: string, options?: ToastOptions) => {
  return toast.success(message, { ...defaultOptions, ...options })
}

export const toastError = (message: string, options?: ToastOptions) => {
  return toast.error(message, { ...defaultOptions, ...options })
}

export const toastInfo = (message: string, options?: ToastOptions) => {
  return toast.info(message, { ...defaultOptions, ...options })
}

export const toastWarning = (message: string, options?: ToastOptions) => {
  return toast.warning(message, { ...defaultOptions, ...options })
}

// For custom styling or more complex toasts
export const toastCustom = (message: string | React.ReactNode, options?: ToastOptions) => {
  return toast(message, { ...defaultOptions, ...options })
}
