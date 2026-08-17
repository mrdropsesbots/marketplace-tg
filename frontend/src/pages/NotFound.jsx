import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: 100 }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🔍</div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Страница не найдена</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: 15 }}>Запрашиваемая страница не существует</p>
      <Link to="/" className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '14px 32px' }}>На главную</Link>
    </div>
  )
}
