import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()

  if (isLoading) return <div className="loading">Загрузка...</div>

  if (!isAuthenticated) return <Navigate to="/" replace />

  if (adminOnly && !isAdmin) return <Navigate to="/" replace />

  return children
}