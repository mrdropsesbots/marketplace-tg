import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/formatPrice.js'

export default function ProductCard({ product, onToggleFavorite, isFavorite }) {
  const image = product.images?.[0]?.image_url || '/images/placeholder.png'

  return (
    <Link
      to={`/product/${product.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ position: 'relative' }}>
          <img
            src={image}
            alt={product.title}
            style={{ width: '100%', height: 160, objectFit: 'cover' }}
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
                top: 8,
                right: 8,
                background: 'rgba(255,255,255,0.9)',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
          )}
        </div>
        <div style={{ padding: 10 }}>
          <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3, marginBottom: 6 }}>
            {product.title}
          </div>
          <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--tg-button)' }}>
            {formatPrice(product.price, product.currency)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--tg-hint)', marginTop: 4 }}>
            {product.category_name || 'Без категории'}
          </div>
        </div>
      </div>
    </Link>
  )
}