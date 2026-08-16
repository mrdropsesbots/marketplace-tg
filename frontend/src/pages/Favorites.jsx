import { useState, useEffect } from 'react'
import api from '../api/axios.js'
import ProductList from '../components/ProductList.jsx'

export default function Favorites() {
  const [products, setProducts] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/favorites')
      setProducts(res.data)
      setFavorites(res.data.map(f => f.product_id))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async (productId) => {
    try {
      await api.delete(`/favorites/${productId}`)
      setProducts(prev => prev.filter(p => p.id !== productId))
      setFavorites(prev => prev.filter(id => id !== productId))
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) return <div className="loading">Загрузка...</div>

  return (
    <div className="container">
      <h2 style={{ marginBottom: 16 }}>Избранное</h2>
      {products.length === 0 ? (
        <div className="empty">Нет избранных товаров</div>
      ) : (
        <ProductList
          products={products}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  )
}