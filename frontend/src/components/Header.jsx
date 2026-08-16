import { useTelegramContext } from '../context/TelegramContext.jsx'

export default function Header() {
  const { user } = useTelegramContext()

  return (
    <header style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user?.photo_url && (
          <img
            src={user.photo_url}
            alt={user.first_name}
            style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
          />
        )}
        <div>
          <div style={{ fontWeight: 600, fontSize: 16 }}>
            {user?.first_name || 'Гость'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--tg-hint)' }}>
            Marketplace
          </div>
        </div>
      </div>
    </header>
  )
}