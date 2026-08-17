import { useTelegramContext } from '../context/TelegramContext.jsx'
import { Link } from 'react-router-dom'

export default function Header() {
  const { user } = useTelegramContext()

  return (
    <header style={{
      padding: '16px 16px 8px',
      background: 'var(--bg)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 0 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.1 }}>MarketPlace</h1>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, letterSpacing: '0.3px' }}>Telegram WebApp</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link to="/profile" style={{
            background: 'linear-gradient(135deg, #ffc107, #ff9800)',
            color: '#000',
            padding: '7px 14px',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            textDecoration: 'none',
            boxShadow: '0 2px 12px rgba(255,193,7,0.3)'
          }}>
            <span>👑</span> VIP
          </Link>
          <button style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}>
            🔔
          </button>
        </div>
      </div>
    </header>
  )
}
