import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: 60 }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
      <h2 style={{ marginBottom: 8 }}>Страница не найдена</h2>
      <p style={{ color: 'var(--tg-hint)', marginBottom: 24 }}>
        Запрашиваемая страница не существует
      </p>
      <Link to="/" className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '12px 32px', textDecoration: 'none' }}>
        На главную
      </Link>
    </div>
  )
}