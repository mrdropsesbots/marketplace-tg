import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { TelegramProvider } from './context/TelegramContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TelegramProvider>
      <AuthProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </AuthProvider>
    </TelegramProvider>
  </React.StrictMode>
)
