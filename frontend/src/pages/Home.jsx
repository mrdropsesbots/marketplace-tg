import { useState, useEffect } from 'react'
import api from '../api/axios.js'
import ProductList from '../components/ProductList.jsx'
import CategoryPills from '../components/CategoryPills.jsx'
import SearchBar from '../components/SearchBar.jsx'
import PromoBanner from '../components/PromoBanner.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const VIP_SHOPS = [
  { id: 1, name: 'SneakerHub', icon: '👟', rating: 4.9, color: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { id: 2, name: 'BeautyPro', icon: '💄', rating: 4.8, color: 'linear-gradient(135deg, #f093fb, #f5576c)' },
]

const SHOP_SLOTS = [
  { id: 1, name: 'StreetWear', desc: 'Одежда и аксессуары', price: 'от 1 990 ₽', orders: '1.2k', color: 'linear-gradient(135deg, #1a1a2e, #16213e)' },
  { id: 2, name: 'AudioMax', desc: 'Наушники и колонки', price: 'от 3 490 ₽', orders: '856', color: 'linear-gradient(135deg, #2d1b1b, #1a0f0f)' },
]

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    fetchCategories()
    fetchProducts()
    if (isAuthenticated) fetchFavorites()
  }, [isAuthenticated])

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(), 300)
    return () => clearTimeout(timer)
  }, [search, categoryId])

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories')
      setCategories(res.data)
    } catch (e) { console.error(e) }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (categoryId) params.append('category', categoryId)
      if (search) params.append('search', search)
      const res = await api.get(`/products?${params}`)
      setProducts(res.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/favorites')
      setFavorites(res.data.map(f => f.product_id || f.id))
    } catch (e) { console.error(e) }
  }

  const toggleFavorite = async (productId) => {
    if (!isAuthenticated) return
    try {
      if (favorites.includes(productId)) {
        await api.delete(`/favorites/${productId}`)
        setFavorites(prev => prev.filter(id => id !== productId))
      } else {
        await api.post(`/favorites/${productId}`)
        setFavorites(prev => [...prev, productId])
      }
    } catch (e) { console.error(e) }
  }

  return (
    <div className="container">
      <SearchBar value={search} onChange={setSearch} />
      <PromoBanner />
      <CategoryPills categories={categories} selected={categoryId} onSelect={setCategoryId} />

      {/* VIP Shops */}
      <SectionHeader title="VIP-магазины" icon="👑" onSeeAll={() => {}} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
        {VIP_SHOPS.map(shop => (
          <div key={shop.id} style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius-xl)',
            padding: 16,
            border: '1px solid var(--border)',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 'var(--radius-lg)',
              background: shop.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              margin: '0 auto 12px'
            }}>
              {shop.icon}
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{shop.name}</div>
            <div style={{ fontSize: 13, color: 'var(--vip)', fontWeight: 600 }}>
              ⭐ {shop.rating} · VIP
            </div>
          </div>
        ))}
      </div>

      {/* Shop Slots */}
      <SectionHeader title="Слоты магазинов" icon="🏪" onSeeAll={() => {}} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
        {SHOP_SLOTS.map(slot => (
          <div key={slot.id} style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            border: '1px solid var(--border)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              height: 120,
              background: slot.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 48
            }}>
              {slot.id === 1 ? '👕' : '🎧'}
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{slot.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{slot.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--accent)' }}>{slot.price}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>🛒 {slot.orders}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Барахолка */}
      <SectionHeader title="Барахолка" icon="📦" onSeeAll={() => {}} />
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--surface-light)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          Загрузка...
        </div>
      ) : (
        <ProductList products={products} favorites={favorites} onToggleFavorite={toggleFavorite} layout="list" />
      )}
    </div>
  )
}
