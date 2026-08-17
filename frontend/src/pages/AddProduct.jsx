import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useTelegram } from '../hooks/useTelegram.js'

export default function AddProduct() {
  const navigate = useNavigate()
  const { isVip } = useAuth()
  const { showBackButton, hideBackButton } = useTelegram()
  const [categories, setCategories] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('BYN')
  const [categoryId, setCategoryId] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    showBackButton(() => navigate(-1))
    return () => hideBackButton()
  }, [])

  useEffect(() => { fetchCategories() }, [])

  const fetchCategories = async () => {
    try { const res = await api.get('/categories'); setCategories(res.data) }
    catch (e) { console.error(e) }
  }

  const handleSubmit = async () => {
    if (!title || !price || !categoryId) { setError('Заполните обязательные поля'); return }
    setLoading(true); setError('')
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('currency', currency)
      formData.append('category_id', categoryId)
      images.forEach(img => formData.append('images', img))
      await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      navigate('/profile')
    } catch (e) { setError(e.response?.data?.message || 'Ошибка при публикации') }
    finally { setLoading(false) }
  }

  const maxImages = isVip ? 10 : 5
  const previews = images.map(file => URL.createObjectURL(file))

  return (
    <div className="container" style={{ paddingTop: 8 }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Новое объявление</h2>
      {error && <div style={{ color: '#ff4757', fontSize: 14, marginBottom: 14, padding: 14, background: 'rgba(255,71,87,0.1)', borderRadius: 'var(--radius-lg)' }}>{error}</div>}

      <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Название *</div>
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Например: iPhone 15 Pro" className="glass-input" style={{ marginBottom: 16 }} />

      <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Категория *</div>
      <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="glass-input" style={{ marginBottom: 16 }}>
        <option value="">Выберите категорию</option>
        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>)}
      </select>

      <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Цена *</div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0" className="glass-input" style={{ flex: 2 }} />
        <select value={currency} onChange={e => setCurrency(e.target.value)} className="glass-input" style={{ flex: 1 }}>
          <option value="BYN">BYN</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="RUB">RUB</option>
        </select>
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Описание</div>
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Опишите товар..." className="glass-input" style={{ minHeight: 120, marginBottom: 16 }} />

      <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Фото ({images.length}/{maxImages})</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
        {previews.map((src, i) => (
          <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} style={{
              position: 'absolute', top: 6, right: 6, background: 'rgba(255,71,87,0.9)', color: '#fff',
              border: 'none', borderRadius: '50%', width: 26, height: 26, fontSize: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>×</button>
          </div>
        ))}
        {images.length < maxImages && (
          <label style={{
            aspectRatio: '1', border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            fontSize: 32, color: 'var(--text-secondary)', background: 'var(--surface)'
          }}>
            +
            <input type="file" accept="image/*" multiple onChange={e => {
              const files = Array.from(e.target.files)
              const available = maxImages - images.length
              setImages(prev => [...prev, ...files.slice(0, available)])
            }} style={{ display: 'none' }} />
          </label>
        )}
      </div>

      <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ marginBottom: 40 }}>
        {loading ? 'Публикация...' : '🚀 Опубликовать'}
      </button>
    </div>
  )
}
