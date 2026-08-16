import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios.js'
import { formatPrice, formatDate } from '../utils/formatPrice.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useTelegram } from '../hooks/useTelegram.js'

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { showBackButton, hideBackButton, openTelegramLink } = useTelegram()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    showBackButton(() => navigate(-1))
    return () => hideBackButton()
  }, [])

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`)
      setProduct(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSold = async () => {
    try {
      await api.patch(`/products/${id}/sold`)
      setProduct(prev => ({ ...prev, status: 'sold' }))
    } catch (e) {
      console.error(e)
    }
  }

  const contactSeller = () => {
    if (!product?.user_telegram_id) return
    openTelegramLink(`https://t.me/user?id=${product.user_telegram_id}`)
  }

  if (loading) return <div className="loading">Загрузка...</div>
  if (!product) return <div className="empty">Товар не найден</div>

  const isOwner = user?.telegram_id === product.user_telegram_id
  const images = product.images || []

  return (
    <div className="container">
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <img
          src={images[currentImage]?.image_url || '/images/placeholder.png'}
          alt={product.title}
          style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 12 }}
        />
        {images.length > 1 && (
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 8 }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  border: 'none',
                  background: i === currentImage ? 'var(--tg-button)' : '#ddd',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        )}
      </div>

      <h1 style={{ fontSize: 22, marginBottom: 8 }}>{product.title}</h1>
      <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--tg-button)', marginBottom: 12 }}>
        {formatPrice(product.price, product.currency)}
      </div>

      <div className="card">
        <div className="label">Описание</div>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
          {product.description || 'Нет описания'}
        </div>
      </div>

      <div className="card">
        <div className="label">Категория</div>
        <div>{product.category_name || '—'}</div>
      </div>

      <div className="card">
        <div className="label">Дата публикации</div>
        <div>{formatDate(product.created_at)}</div>
      </div>

      {product.status === 'sold' && (
        <div className="card" style={{ background: '#e74c3c', color: '#fff', textAlign: 'center' }}>
          Продано
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        {!isOwner && product.status !== 'sold' && (
          <button onClick={contactSeller} className="btn-primary">
            Написать продавцу
          </button>
        )}
        {isOwner && product.status !== 'sold' && (
          <button onClick={handleSold} className="btn-primary" style={{ background: '#27ae60' }}>
            Отметить проданным
          </button>
        )}
      </div>
    </div>
  )
}