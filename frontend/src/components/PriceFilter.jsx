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
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
      <input type="number" placeholder="От" value={min} onChange={e => setMin(e.target.value)} className="glass-input" style={{ flex: 1 }} />
      <span style={{ color: 'var(--text-secondary)' }}>—</span>
      <input type="number" placeholder="До" value={max} onChange={e => setMax(e.target.value)} className="glass-input" style={{ flex: 1 }} />
      <button onClick={handleApply} className="btn-primary" style={{ width: 'auto', padding: '12px 18px' }}>OK</button>
    </div>
  )
}
