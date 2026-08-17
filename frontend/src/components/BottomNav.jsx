import { NavLink, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const location = useLocation()
  const hiddenPaths = ['/add-product', '/admin']
  if (hiddenPaths.some(p => location.pathname.startsWith(p))) return null

  const navItems = [
    { to: '/', label: 'Главная', icon: '🏠' },
    { to: '/search', label: 'Поиск', icon: '🔍' },
    { to: '/add-product', label: 'Разместить', icon: '➕' },
    { to: '/chats', label: 'Чаты', icon: '💬' },
    { to: '/profile', label: 'Профиль', icon: '👤' },
  ]

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(10,10,15,0.92)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '8px 0 calc(8px + env(safe-area-inset-bottom))',
      zIndex: 100,
      maxWidth: 600,
      margin: '0 auto',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)'
    }}>
      {navItems.map(item => {
        const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))
        return (
          <NavLink
            key={item.to}
            to={item.to}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              fontSize: 10,
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              textDecoration: 'none',
              flex: 1,
              padding: '4px 0',
              transition: 'color 0.2s',
              position: 'relative'
            }}
          >
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <span style={{ fontWeight: 500 }}>{item.label}</span>
            {isActive && (
              <span style={{
                position: 'absolute',
                bottom: -2,
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: 'var(--accent)'
              }} />
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
