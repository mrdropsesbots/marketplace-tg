import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/formatPrice.js'

export default function ProductCard({ product, onToggleFavorite, isFavorite, layout = 'grid' }) {
  const image = product.images?.[0]?.image_url || 'https://via.placeholder.com/300x300/1e1e2d/5b5b7b?text=No+Photo'

  if (layout === 'list') {
    return (
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }} className="animate-in">
        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
          padding: 14,
          display: 'flex',
          gap: 14,
          alignItems: 'center',
          transition: 'border-color 0.2s, transform 0.15s',
          backdropFilter: 'blur(10px)'
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <img
            src={image}
            alt={product.title}
            style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0, background: 'var(--surface-light)' }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {product.title}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {product.description || 'Нет описания'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--accent)' }}>
                {formatPrice(product.price, product.currency)}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onToggleFavorite?.(product.id)
                }}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-light)',
                  color: 'var(--text-secondary)',
                  fontSize: 13,
                  fontWeight: 600,
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                💬 Написать
              </button>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Grid layout (default)
  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }} className="animate-in">
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        transition: 'border-color 0.2s, transform 0.15s',
        backdropFilter: 'blur(10px)'
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        <div style={{ position: 'relative' }}>
          <img
            src={image}
            alt={product.title}
            style={{ width: '100%', height: 160, objectFit: 'cover', background: 'var(--surface-light)' }}
          />
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggleFavorite(product.id)
              }}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(10px)',
                borderRadius: '50%',
                width: 34,
                height: 34,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                color: isFavorite ? '#ff4757' : '#fff'
              }}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
          )}
        </div>
        <div style={{ padding: 14 }}>
          <div style={{
            fontWeight: 700,
            fontSize: 14,
            lineHeight: 1.3,
            marginBottom: 6,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {product.title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{
              fontWeight: 800,
              fontSize: 16,
              color: 'var(--accent)'
            }}>
              {formatPrice(product.price, product.currency)}
            </div>
            {product.category_name && (
              <span style={{
                fontSize: 10,
                color: 'var(--text-secondary)',
                background: 'var(--surface-light)',
                padding: '3px 8px',
                borderRadius: 8,
                fontWeight: 600
              }}>
                {product.category_name}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
