import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { TelegramProvider } from './context/TelegramContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TelegramProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </TelegramProvider>
  </React.StrictMode>,
)