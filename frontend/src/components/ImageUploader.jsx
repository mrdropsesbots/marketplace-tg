import { useState } from 'react'

const MAX_VIP = 10
const MAX_REGULAR = 5

export default function ImageUploader({ images, onChange, isVip }) {
  const maxCount = isVip ? MAX_VIP : MAX_REGULAR
  const [previews, setPreviews] = useState([])

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const availableSlots = maxCount - images.length
    const toAdd = files.slice(0, availableSlots)
    if (toAdd.length === 0) return
    const newPreviews = toAdd.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...newPreviews])
    onChange([...images, ...toAdd])
  }

  const removeImage = (index) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    onChange(newImages)
    const newPreviews = [...previews]
    URL.revokeObjectURL(newPreviews[index])
    newPreviews.splice(index, 1)
    setPreviews(newPreviews)
  }

  const allPreviews = images.map((img, i) =>
    typeof img === 'string' ? img : previews[i]
  ).filter(Boolean)

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Фото ({images.length}/{maxCount})
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {allPreviews.map((src, i) => (
          <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--surface)' }}>
            <img src={src} alt={`preview-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button onClick={() => removeImage(i)} style={{
              position: 'absolute', top: 6, right: 6, background: 'rgba(255,71,87,0.9)', color: '#fff',
              border: 'none', borderRadius: '50%', width: 26, height: 26, fontSize: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>×</button>
          </div>
        ))}
        {images.length < maxCount && (
          <label style={{
            aspectRatio: '1', border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            fontSize: 28, color: 'var(--text-secondary)', background: 'var(--surface)'
          }}>
            +
            <input type="file" accept="image/*" multiple onChange={handleFileChange} style={{ display: 'none' }} />
          </label>
        )}
      </div>
    </div>
  )
}
