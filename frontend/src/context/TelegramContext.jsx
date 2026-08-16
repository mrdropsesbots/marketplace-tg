import { createContext, useContext, useEffect, useState } from 'react'

const TelegramContext = createContext(null)

export const TelegramProvider = ({ children }) => {
  const [tg, setTg] = useState(null)
  const [user, setUser] = useState(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const telegram = window.Telegram?.WebApp
    if (telegram) {
      telegram.ready()
      telegram.expand()
      setTg(telegram)
      setUser(telegram.initDataUnsafe?.user)
      setIsReady(true)
    }
  }, [])

  const value = {
    tg,
    user,
    isReady,
    initData: tg?.initData || '',
  }

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  )
}

export const useTelegramContext = () => {
  const context = useContext(TelegramContext)
  if (!context) {
    throw new Error('useTelegramContext must be used within TelegramProvider')
  }
  return context
}