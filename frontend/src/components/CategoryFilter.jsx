export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '4px 0', marginBottom: 12 }}>
      <button
        onClick={() => onSelect('')}
        style={{
          padding: '8px 16px',
          borderRadius: 20,
          border: 'none',
          background: selected === '' ? 'var(--tg-button)' : 'var(--tg-secondary-bg)',
          color: selected === '' ? 'var(--tg-button-text)' : 'var(--tg-text)',
          fontSize: 14,
          whiteSpace: 'nowrap',
          cursor: 'pointer',
        }}
      >
        Все
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          style={{
            padding: '8px 16px',
            borderRadius: 20,
            border: 'none',
            background: selected === cat.id ? 'var(--tg-button)' : 'var(--tg-secondary-bg)',
            color: selected === cat.id ? 'var(--tg-button-text)' : 'var(--tg-text)',
            fontSize: 14,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          {cat.icon && <span style={{ marginRight: 4 }}>{cat.icon}</span>}
          {cat.name}
        </button>
      ))}
    </div>
  )
}