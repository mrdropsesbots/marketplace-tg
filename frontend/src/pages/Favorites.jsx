import { useState, useEffect } from 'react'
import api from '../api/axios.js'
import ProductList from '../components/ProductList.jsx'

export default function Favorites() {
  const [products, setProducts] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchFavorites() }, [])

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/favorites')
      setProducts(res.data)
      setFavorites(res.data.map(f => f.product_id || f.id))
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const toggleFavorite = async (productId) => {
    try {
      await api.delete(`/favorites/${productId}`)
      setProducts(prev => prev.filter(p => p.id !== productId))
      setFavorites(prev => prev.filter(id => id !== productId))
    } catch (e) { console.error(e) }
  }

  return (
    <div className="container" style={{ paddingTop: 8 }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>❤️ Избранное</h2>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--surface-light)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          Загрузка...
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💔</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Нет избранных товаров</div>
        </div>
      ) : (
        <ProductList products={products} favorites={favorites} onToggleFavorite={toggleFavorite} layout="list" />
      )}
    </div>
  )
}
