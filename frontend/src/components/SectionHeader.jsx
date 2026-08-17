export default function SectionHeader({ title, icon, onSeeAll, actionColor = 'var(--accent)' }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
      marginTop: 8
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
        <h2 style={{ fontSize: 18, fontWeight: 800 }}>{title}</h2>
      </div>
      {onSeeAll && (
        <button
          onClick={onSeeAll}
          style={{
            color: actionColor,
            fontSize: 14,
            fontWeight: 600,
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer'
          }}
        >
          Все <span>→</span>
        </button>
      )}
    </div>
  )
}
