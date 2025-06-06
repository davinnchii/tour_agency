// Custom hook for auth-related operations
import { useAppSelector, useAppDispatch } from "@/app/store"
import { logoutAsync as logout } from "../features/auth/authSlice"

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const token = useAppSelector((state) => state.auth.token)
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  const handleLogout = () => {
    dispatch(logout())
  }

  const isOperator = user?.role === "operator"
  const isAgent = user?.role === "agent"

  return {
    user,
    token,
    isAuthenticated,
    isOperator,
    isAgent,
    logout: handleLogout,
  }
}
