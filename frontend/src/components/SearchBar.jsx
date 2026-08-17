export default function SearchBar({ value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 16px',
        border: '1px solid var(--border)',
        backdropFilter: 'blur(10px)',
        transition: 'border-color 0.2s'
      }}>
        <span style={{ fontSize: 18, opacity: 0.5, flexShrink: 0 }}>🔍</span>
        <input
          type="text"
          placeholder="Поиск товаров, услуг, аренды..."
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            color: 'var(--text)',
            fontSize: 15,
            outline: 'none',
            fontFamily: 'inherit'
          }}
        />
      </div>
    </div>
  )
}
