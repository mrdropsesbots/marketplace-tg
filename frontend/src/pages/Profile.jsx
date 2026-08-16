import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import { formatPrice } from '../utils/formatPrice.js'

export default function Profile() {
  const { user, isVip, isAdmin, refreshUser } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [promoCode, setPromoCode] = useState('')
  const [promoError, setPromoError] = useState('')
  const [promoSuccess, setPromoSuccess] = useState('')

  useEffect(() => {
    fetchMyProducts()
  }, [])

  const fetchMyProducts = async () => {
    try {
      const res = await api.get('/products?my=1')
      setProducts(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const applyPromo = async () => {
    if (!promoCode.trim()) return
    setPromoError('')
    setPromoSuccess('')

    try {
      await api.post('/promo/apply', { code: promoCode })
      setPromoSuccess('Промокод применён!')
      refreshUser()
    } catch (e) {
      setPromoError(e.response?.data?.message || 'Неверный промокод')
    }
  }

  return (
    <div className="container">
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {user?.photo_url && (
          <img
            src={user.photo_url}
            alt={user.first_name}
            style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }}
          />
        )}
        <div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            {user?.first_name} {user?.last_name}
          </div>
          <div style={{ fontSize: 14, color: 'var(--tg-hint)' }}>
            @{user?.username || 'нет username'}
          </div>
          {isVip && (
            <div style={{
              display: 'inline-block',
              marginTop: 4,
              padding: '2px 10px',
              background: 'gold',
              color: '#000',
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 700,
            }}>
              VIP
            </div>
          )}
        </div>
      </div>

      {!isVip && (
        <div className="card">
          <div className="label">Промокод VIP</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={promoCode}
              onChange={e => setPromoCode(e.target.value)}
              className="input"
              placeholder="Введите код"
              style={{ flex: 1, marginBottom: 0 }}
            />
            <button onClick={applyPromo} className="btn-primary" style={{ width: 'auto' }}>
              OK
            </button>
          </div>
          {promoError && <div className="error">{promoError}</div>}
          {promoSuccess && <div style={{ color: '#27ae60', fontSize: 14 }}>{promoSuccess}</div>}
        </div>
      )}

      {isAdmin && (
        <Link to="/admin" className="btn-primary" style={{ display: 'block', textAlign: 'center', marginBottom: 12, textDecoration: 'none' }}>
          Модерация
        </Link>
      )}

      <h3 style={{ marginBottom: 12 }}>Мои объявления</h3>

      {loading ? (
        <div className="loading">Загрузка...</div>
      ) : products.length === 0 ? (
        <div className="empty">Нет объявлений</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {products.map(p => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <img
                  src={p.images?.[0]?.image_url || '/images/placeholder.png'}
                  alt={p.title}
                  style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{p.title}</div>
                  <div style={{ color: 'var(--tg-button)', fontWeight: 700 }}>
                    {formatPrice(p.price, p.currency)}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--tg-hint)' }}>
                    {p.moderation_status === 'pending' && '⏳ На модерации'}
                    {p.moderation_status === 'approved' && '✅ Одобрено'}
                    {p.moderation_status === 'rejected' && `❌ Отклонено: ${p.rejection_reason || ''}`}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}