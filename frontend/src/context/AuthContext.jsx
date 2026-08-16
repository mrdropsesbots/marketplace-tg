import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios.js'
import { useTelegramContext } from './TelegramContext.jsx'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const { initData, user: tgUser } = useTelegramContext()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const login = async () => {
      if (!initData) {
        setIsLoading(false)
        return
      }

      try {
        const response = await api.post('/auth/login', { initData })
        setUser(response.data.user)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Auth error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    login()
  }, [initData])

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  const refreshUser = async () => {
    try {
      const response = await api.get('/vip/status')
      setUser((prev) => ({ ...prev, ...response.data }))
    } catch (error) {
      console.error('Refresh user error:', error)
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated,
    logout,
    refreshUser,
    isAdmin: user?.is_admin || false,
    isVip: user?.is_vip || false,
  }

  if (isLoading) {
    return <div className="loading">Загрузка...</div>
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}