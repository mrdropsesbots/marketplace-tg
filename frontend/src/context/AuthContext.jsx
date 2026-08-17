import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios.js'
import { useTelegramContext } from './TelegramContext.jsx'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const { initData } = useTelegramContext()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const login = async () => {
      let data = initData
      if (!data && window.Telegram?.WebApp?.initData) data = window.Telegram.WebApp.initData
      if (!data) { setIsLoading(false); return }
      try {
        const res = await api.post('/auth/login', { initData: data })
        setUser(res.data.user)
        setIsAuthenticated(true)
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
      } catch (e) { console.error('Auth error:', e.response?.data || e.message) }
      finally { setIsLoading(false) }
    }
    login()
  }, [initData])

  const logout = () => {
    setUser(null); setIsAuthenticated(false)
    delete api.defaults.headers.common['Authorization']
  }

  const refreshUser = async () => {
    try {
      const res = await api.get('/vip/status')
      setUser(prev => ({ ...prev, ...res.data }))
    } catch (e) { console.error(e) }
  }

  const value = {
    user, isLoading, isAuthenticated, logout, refreshUser,
    isAdmin: user?.is_admin || false,
    isVip: user?.is_vip || false
  }

  if (isLoading) return (
    <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--surface-light)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
      Загрузка...
    </div>
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
