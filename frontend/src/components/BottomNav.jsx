import { NavLink, useLocation } from 'react-router-dom'

export default function BottomNav() {
  const location = useLocation()
  const hiddenPaths = ['/add-product', '/admin']
  if (hiddenPaths.some(p => location.pathname.startsWith(p))) return null

  const navItems = [
    { to: '/', label: 'Главная', icon: '🏠' },
    { to: '/favorites', label: 'Избранное', icon: '❤️' },
    { to: '/add-product', label: 'Добавить', icon: '➕' },
    { to: '/profile', label: 'Профиль', icon: '👤' },
  ]

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'var(--tg-bg)',
      borderTop: '1px solid #eee',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '8px 0',
      zIndex: 100,
      maxWidth: 600,
      margin: '0 auto',
    }}>
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            fontSize: 11,
            color: isActive ? 'var(--tg-button)' : 'var(--tg-hint)',
            textDecoration: 'none',
            flex: 1,
          })}
        >
          <span style={{ fontSize: 20 }}>{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}