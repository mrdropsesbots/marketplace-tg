import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios.js'
import ImageUploader from '../components/ImageUploader.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useTelegram } from '../hooks/useTelegram.js'

export default function AddProduct() {
  const navigate = useNavigate()
  const { user, isVip } = useAuth()
  const { showBackButton, hideBackButton, showMainButton, hideMainButton } = useTelegram()
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

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (title && price && categoryId) {
      showMainButton('Опубликовать', handleSubmit)
    } else {
      hideMainButton()
    }
    return () => hideMainButton()
  }, [title, price, categoryId, description, images, currency])

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories')
      setCategories(res.data)
    } catch (e) {
      console.error(e)
    }
  }

  const handleSubmit = async () => {
    if (!title || !price || !categoryId) {
      setError('Заполните обязательные поля')
      return
    }

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('currency', currency)
      formData.append('category_id', categoryId)

      images.forEach((img, i) => {
        formData.append(`images`, img)
      })

      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      navigate('/profile')
    } catch (e) {
      setError(e.response?.data?.message || 'Ошибка при публикации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: 16 }}>Новое объявление</h2>

      {error && <div className="error">{error}</div>}

      <div className="label">Название *</div>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="input"
        placeholder="Например: iPhone 15 Pro"
      />

      <div className="label">Категория *</div>
      <select
        value={categoryId}
        onChange={e => setCategoryId(e.target.value)}
        className="select"
      >
        <option value="">Выберите категорию</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <div className="label">Цена *</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="input"
          placeholder="0"
          style={{ flex: 2, marginBottom: 0 }}
        />
        <select
          value={currency}
          onChange={e => setCurrency(e.target.value)}
          className="select"
          style={{ flex: 1, marginBottom: 0 }}
        >
          <option value="BYN">BYN</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="RUB">RUB</option>
        </select>
      </div>

      <div className="label">Описание</div>
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="textarea"
        placeholder="Опишите товар..."
      />

      <ImageUploader images={images} onChange={setImages} isVip={isVip} />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn-primary"
        style={{ marginTop: 8 }}
      >
        {loading ? 'Публикация...' : 'Опубликовать'}
      </button>
    </div>
  )
}