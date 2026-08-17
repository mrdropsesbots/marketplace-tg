import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const initData = window.Telegram?.WebApp?.initData
  if (initData) config.headers['X-Telegram-Init-Data'] = initData
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) console.error('Unauthorized')
    return Promise.reject(error)
  }
)

export default api
