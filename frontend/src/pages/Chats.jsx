export default function Chats() {
  return (
    <div className="container" style={{ paddingTop: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
      <div style={{ fontSize: 56, marginBottom: 20 }}>💬</div>
      <h2 style={{ color: 'var(--text)', marginBottom: 10, fontSize: 20, fontWeight: 800 }}>Чаты</h2>
      <p style={{ fontSize: 15 }}>Здесь будут ваши переписки с продавцами</p>
      <div style={{ marginTop: 30, padding: 20, background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Пока сообщений нет. Начните общение, нажав «Написать продавцу» на карточке товара.</div>
      </div>
    </div>
  )
}
