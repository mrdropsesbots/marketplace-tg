import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()

  if (isLoading) return (
    <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--surface-light)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
      Загрузка...
    </div>
  )
  if (!isAuthenticated) return <Navigate to="/" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />

  return children
}
