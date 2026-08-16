import { useState } from 'react'

export default function PriceFilter({ onApply }) {
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')

  const handleApply = () => {
    onApply({
      minPrice: min ? Number(min) : undefined,
      maxPrice: max ? Number(max) : undefined,
    })
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
      <input
        type="number"
        placeholder="От"
        value={min}
        onChange={e => setMin(e.target.value)}
        className="input"
        style={{ flex: 1, marginBottom: 0 }}
      />
      <span style={{ color: 'var(--tg-hint)' }}>—</span>
      <input
        type="number"
        placeholder="До"
        value={max}
        onChange={e => setMax(e.target.value)}
        className="input"
        style={{ flex: 1, marginBottom: 0 }}
      />
      <button onClick={handleApply} className="btn-primary" style={{ width: 'auto', padding: '12px 16px' }}>
        OK
      </button>
    </div>
  )
}