import { useState } from 'react'
import { MAX_IMAGES } from '../utils/constants.js'

export default function ImageUploader({ images, onChange, isVip }) {
  const maxCount = isVip ? MAX_IMAGES.VIP : MAX_IMAGES.REGULAR
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

  const allImages = [...previews]

  return (
    <div style={{ marginBottom: 16 }}>
      <div className="label">Фото ({images.length}/{maxCount})</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {allImages.map((src, i) => (
          <div key={i} style={{ position: 'relative', aspectRatio: '1' }}>
            <img
              src={src}
              alt={`preview-${i}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                background: 'rgba(231,76,60,0.9)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 24,
                height: 24,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>
        ))}
        {images.length < maxCount && (
          <label style={{
            aspectRatio: '1',
            border: '2px dashed #ddd',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 28,
            color: 'var(--tg-hint)',
          }}>
            +
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </label>
        )}
      </div>
    </div>
  )
}