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

  useEffect(() => { fetchMyProducts() }, [])

  const fetchMyProducts = async () => {
    try { const res = await api.get('/products?my=1'); setProducts(res.data) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const applyPromo = async () => {
    if (!promoCode.trim()) return
    setPromoError(''); setPromoSuccess('')
    try {
      await api.post('/promo/apply', { code: promoCode })
      setPromoSuccess('✅ VIP активирован!')
      refreshUser()
    } catch (e) { setPromoError(e.response?.data?.message || 'Неверный промокод') }
  }

  return (
    <div className="container" style={{ paddingTop: 8 }}>
      {/* Profile Card */}
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: 20,
        marginBottom: 18, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16,
        backdropFilter: 'blur(10px)'
      }}>
        {user?.photo_url ? (
          <img src={user.photo_url} alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} />
        ) : (
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #00b894)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 800, fontSize: 24
          }}>{user?.first_name?.[0] || '?'}</div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{user?.first_name} {user?.last_name}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>@{user?.username || 'нет username'}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            {isVip && <span className="badge badge-vip">👑 VIP</span>}
            {isAdmin && <span className="badge badge-danger">🛡️ ADMIN</span>}
          </div>
        </div>
      </div>

      {/* Promo Code */}
      {!isVip && (
        <div style={{
          background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: 18,
          marginBottom: 18, border: '1px solid var(--border)', backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Промокод VIP</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="Введите код" className="glass-input" style={{ flex: 1 }} />
            <button onClick={applyPromo} className="btn-primary" style={{ width: 'auto', padding: '12px 24px' }}>OK</button>
          </div>
          {promoError && <div style={{ color: 'var(--danger)', fontSize: 13, marginTop: 10 }}>{promoError}</div>}
          {promoSuccess && <div style={{ color: 'var(--accent)', fontSize: 13, marginTop: 10 }}>{promoSuccess}</div>}
        </div>
      )}

      {/* Admin Link */}
      {isAdmin && (
        <Link to="/admin" style={{
          display: 'block', textAlign: 'center', padding: '14px', borderRadius: 'var(--radius-lg)',
          background: 'var(--danger-soft)', color: 'var(--danger)', fontWeight: 700, fontSize: 15,
          marginBottom: 18, border: '1px solid rgba(255,71,87,0.2)', textDecoration: 'none'
        }}>🛡️ Панель модерации</Link>
      )}

      {/* My Products */}
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>📦 Мои объявления</h2>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>Загрузка...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)', fontSize: 14 }}>У вас пока нет объявлений</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {products.map(p => (
            <Link key={p.id} to={`/product/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: 14,
                border: '1px solid var(--border)', display: 'flex', gap: 14, alignItems: 'center',
                backdropFilter: 'blur(10px)', transition: 'border-color 0.2s'
              }}>
                <img src={p.images?.[0]?.image_url || 'https://via.placeholder.com/60x60/1e1e2d/5b5b7b?text=No+Photo'}
                  alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                  <div style={{ color: 'var(--accent)', fontWeight: 800, fontSize: 15, marginTop: 3 }}>{formatPrice(p.price, p.currency)}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                    {p.moderation_status === 'pending' && <span className="badge badge-pending">На модерации</span>}
                    {p.moderation_status === 'approved' && <span className="badge badge-approved">Одобрено</span>}
                    {p.moderation_status === 'rejected' && <span className="badge badge-rejected">Отклонено</span>}
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
