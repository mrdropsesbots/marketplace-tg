export default function CategoryPills({ categories, selected, onSelect }) {
  return (
    <div style={{
      display: 'flex',
      gap: 10,
      overflowX: 'auto',
      padding: '4px 0 16px',
      scrollbarWidth: 'none',
      marginBottom: 4
    }}>
      <button
        onClick={() => onSelect('')}
        style={{
          padding: '10px 18px',
          borderRadius: 20,
          border: '1px solid',
          borderColor: selected === '' ? 'var(--accent)' : 'var(--border)',
          background: selected === '' ? 'var(--accent)' : 'var(--surface)',
          color: selected === '' ? '#000' : 'var(--text)',
          fontSize: 14,
          fontWeight: 600,
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          transition: 'all 0.2s',
          flexShrink: 0,
          backdropFilter: 'blur(10px)'
        }}
      >
        Все
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          style={{
            padding: '10px 18px',
            borderRadius: 20,
            border: '1px solid',
            borderColor: selected === cat.id ? 'var(--accent)' : 'var(--border)',
            background: selected === cat.id ? 'var(--accent)' : 'var(--surface)',
            color: selected === cat.id ? '#000' : 'var(--text)',
            fontSize: 14,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            transition: 'all 0.2s',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            backdropFilter: 'blur(10px)'
          }}
        >
          <span>{cat.icon}</span>
          {cat.name}
        </button>
      ))}
    </div>
  )
}
