export default function PromoBanner() {
  return (
    <div style={{
      background: 'var(--promo-bg)',
      borderRadius: 'var(--radius-xl)',
      padding: 20,
      marginBottom: 20,
      border: '1px solid rgba(255,255,255,0.05)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: 'rgba(255,255,255,0.08)',
        padding: '5px 12px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: 'var(--text)'
      }}>
        <span>🔥</span> Промокод
      </div>
      <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, lineHeight: 1.2 }}>-30% на первую аренду</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>Действует до конца месяца</p>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{
          background: '#fff',
          color: '#e74c3c',
          padding: '10px 20px',
          borderRadius: 12,
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: '1px'
        }}>
          FLAT30
        </div>
        <button style={{
          flex: 1,
          padding: '10px 20px',
          borderRadius: 12,
          background: 'rgba(255,255,255,0.08)',
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          border: '1px solid rgba(255,255,255,0.1)',
          cursor: 'pointer'
        }}>
          Скопировать
        </button>
      </div>
    </div>
  )
}
