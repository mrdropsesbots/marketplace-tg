import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios.js'
import { formatPrice } from '../utils/formatPrice.js'
import { useTelegram } from '../hooks/useTelegram.js'

export default function AdminModeration() {
  const navigate = useNavigate()
  const { showBackButton, hideBackButton } = useTelegram()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectingId, setRejectingId] = useState(null)

  useEffect(() => {
    showBackButton(() => navigate(-1))
    return () => hideBackButton()
  }, [])

  useEffect(() => { fetchModerationQueue() }, [])

  const fetchModerationQueue = async () => {
    try { const res = await api.get('/admin/moderation'); setProducts(res.data) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const approve = async (id) => {
    try { await api.post(`/admin/moderation/${id}/approve`); setProducts(prev => prev.filter(p => p.id !== id)) }
    catch (e) { console.error(e) }
  }

  const reject = async (id) => {
    if (!rejectReason.trim()) return
    try {
      await api.post(`/admin/moderation/${id}/reject`, { reason: rejectReason })
      setProducts(prev => prev.filter(p => p.id !== id))
      setRejectingId(null); setRejectReason('')
    } catch (e) { console.error(e) }
  }

  if (loading) return (
    <div className="container" style={{ paddingTop: 60, textAlign: 'center', color: 'var(--text-secondary)' }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--surface-light)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
      Загрузка...
    </div>
  )

  return (
    <div className="container" style={{ paddingTop: 8 }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>🛡️ Модерация</h2>
      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✅</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Все товары проверены</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {products.map(p => (
            <div key={p.id} style={{
              background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: 16,
              border: '1px solid var(--border)', backdropFilter: 'blur(10px)'
            }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <img src={p.images?.[0]?.image_url || 'https://via.placeholder.com/80x80/1e1e2d/5b5b7b?text=No+Photo'}
                  alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{p.title}</div>
                  <div style={{ color: 'var(--accent)', fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{formatPrice(p.price, p.currency)}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.category_name} • {p.user_first_name || 'Аноним'}</div>
                </div>
              </div>
              {p.description && (
                <div style={{ fontSize: 14, marginBottom: 12, padding: 12, background: 'var(--bg)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {p.description}
                </div>
              )}
              {rejectingId === p.id ? (
                <div style={{ marginBottom: 8 }}>
                  <input type="text" value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Причина отклонения" className="glass-input" style={{ marginBottom: 10 }} />
                  <div className="btn-group">
                    <button onClick={() => reject(p.id)} className="btn-danger">Подтвердить</button>
                    <button onClick={() => setRejectingId(null)} className="btn-secondary">Отмена</button>
                  </div>
                </div>
              ) : (
                <div className="btn-group">
                  <button onClick={() => approve(p.id)} style={{
                    flex: 1, padding: '12px', borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-soft)', color: 'var(--accent)',
                    fontWeight: 700, fontSize: 14, border: '1px solid var(--accent)', cursor: 'pointer'
                  }}>✅ Одобрить</button>
                  <button onClick={() => setRejectingId(p.id)} style={{
                    flex: 1, padding: '12px', borderRadius: 'var(--radius-md)',
                    background: 'var(--danger-soft)', color: 'var(--danger)',
                    fontWeight: 700, fontSize: 14, border: '1px solid var(--danger)', cursor: 'pointer'
                  }}>❌ Отклонить</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
