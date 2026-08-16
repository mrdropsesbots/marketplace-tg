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

  useEffect(() => {
    fetchModerationQueue()
  }, [])

  const fetchModerationQueue = async () => {
    try {
      const res = await api.get('/admin/moderation')
      setProducts(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const approve = async (id) => {
    try {
      await api.post(`/admin/moderation/${id}/approve`)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  const reject = async (id) => {
    if (!rejectReason.trim()) return
    try {
      await api.post(`/admin/moderation/${id}/reject`, { reason: rejectReason })
      setProducts(prev => prev.filter(p => p.id !== id))
      setRejectingId(null)
      setRejectReason('')
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) return <div className="loading">Загрузка...</div>

  return (
    <div className="container">
      <h2 style={{ marginBottom: 16 }}>Модерация</h2>

      {products.length === 0 ? (
        <div className="empty">Нет товаров на модерации</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {products.map(p => (
            <div key={p.id} className="card">
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <img
                  src={p.images?.[0]?.image_url || '/images/placeholder.png'}
                  alt={p.title}
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{p.title}</div>
                  <div style={{ color: 'var(--tg-button)', fontWeight: 700 }}>
                    {formatPrice(p.price, p.currency)}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--tg-hint)' }}>
                    {p.category_name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--tg-hint)', marginTop: 4 }}>
                    Автор: {p.user_first_name || '—'}
                  </div>
                </div>
              </div>

              {p.description && (
                <div style={{ fontSize: 14, marginBottom: 12, color: 'var(--tg-text)' }}>
                  {p.description}
                </div>
              )}

              {rejectingId === p.id ? (
                <div style={{ marginBottom: 12 }}>
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    className="input"
                    placeholder="Причина отклонения"
                    style={{ marginBottom: 8 }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => reject(p.id)} className="btn-primary" style={{ background: '#e74c3c' }}>
                      Подтвердить отклонение
                    </button>
                    <button onClick={() => setRejectingId(null)} className="btn-primary" style={{ background: '#95a5a6' }}>
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => approve(p.id)} className="btn-primary" style={{ background: '#27ae60' }}>
                    Одобрить
                  </button>
                  <button onClick={() => setRejectingId(p.id)} className="btn-primary" style={{ background: '#e74c3c' }}>
                    Отклонить
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}