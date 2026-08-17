import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios.js'
import { formatPrice } from '../utils/formatPrice.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useTelegram } from '../hooks/useTelegram.js'

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showBackButton, hideBackButton } = useTelegram()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    showBackButton(() => navigate(-1))
    return () => hideBackButton()
  }, [])

  useEffect(() => { fetchProduct() }, [id])

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`)
      setProduct(res.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleSold = async () => {
    try {
      await api.patch(`/products/${id}/sold`)
      setProduct(prev => ({ ...prev, status: 'sold' }))
    } catch (e) { console.error(e) }
  }

  const contactSeller = () => {
    if (!product?.user_telegram_id) return
    window.open(`https://t.me/user?id=${product.user_telegram_id}`, '_blank')
  }

  if (loading) return (
    <div className="container" style={{ paddingTop: 60, textAlign: 'center', color: 'var(--text-secondary)' }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--surface-light)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
      Загрузка...
    </div>
  )
  if (!product) return (
    <div className="container" style={{ paddingTop: 60, textAlign: 'center', color: 'var(--text-secondary)' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
      <div style={{ fontSize: 16 }}>Товар не найден</div>
    </div>
  )

  const isOwner = user?.telegram_id === product.user_telegram_id
  const images = product.images || []

  return (
    <div className="container">
      {/* Image Gallery */}
      <div style={{ position: 'relative', margin: '-16px -16px 20px' }}>
        <img src={images[currentImage]?.image_url || 'https://via.placeholder.com/600x400/1e1e2d/5b5b7b?text=No+Photo'}
          alt={product.title} style={{ width: '100%', height: 340, objectFit: 'cover' }} />
        {images.length > 1 && (
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: -30, position: 'relative', zIndex: 2 }}>
            {images.map((_, i) => (
              <button key={i} onClick={() => setCurrentImage(i)} style={{
                width: 8, height: 8, borderRadius: '50%', border: 'none',
                background: i === currentImage ? 'var(--accent)' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer', transition: 'all 0.2s'
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Title & Price */}
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, lineHeight: 1.3 }}>{product.title}</h1>
      <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent)', marginBottom: 20 }}>
        {formatPrice(product.price, product.currency)}
      </div>

      {/* Description Card */}
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: 18,
        marginBottom: 14, border: '1px solid var(--border)', backdropFilter: 'blur(10px)'
      }}>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Описание</div>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--text-secondary)', fontSize: 15 }}>
          {product.description || 'Нет описания'}
        </div>
      </div>

      {/* Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: 16, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' }}>Категория</div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{product.category_name || '—'}</div>
        </div>
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: 16, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' }}>Статус</div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>
            {product.status === 'sold'
              ? <span style={{ color: 'var(--danger)' }}>Продано</span>
              : <span style={{ color: 'var(--accent)' }}>В наличии</span>
            }
          </div>
        </div>
      </div>

      {/* Seller */}
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: 16,
        marginBottom: 20, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #00b894)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: '#000'
        }}>{product.user_first_name?.[0] || '?'}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{product.user_first_name || 'Аноним'}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Продавец</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 12, marginTop: 10, marginBottom: 30 }}>
        {!isOwner && product.status !== 'sold' && (
          <button onClick={contactSeller} className="btn-primary" style={{ flex: 1, padding: '16px', borderRadius: 'var(--radius-lg)', fontSize: 16 }}>
            💬 Написать продавцу
          </button>
        )}
        {isOwner && product.status !== 'sold' && (
          <button onClick={handleSold} style={{
            flex: 1, padding: '16px', borderRadius: 'var(--radius-lg)',
            background: 'var(--accent-soft)', color: 'var(--accent)',
            fontWeight: 800, fontSize: 16, border: '1px solid var(--accent)', cursor: 'pointer'
          }}>✅ Отметить проданным</button>
        )}
      </div>
    </div>
  )
}
