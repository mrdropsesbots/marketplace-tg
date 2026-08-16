import { useState, useEffect } from 'react'
import api from '../api/axios.js'
import ProductList from '../components/ProductList.jsx'
import CategoryFilter from '../components/CategoryFilter.jsx'
import PriceFilter from '../components/PriceFilter.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [priceFilter, setPriceFilter] = useState({})
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    fetchCategories()
    fetchProducts()
    if (isAuthenticated) fetchFavorites()
  }, [isAuthenticated])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts()
    }, 300)
    return () => clearTimeout(timer)
  }, [search, categoryId, priceFilter])

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories')
      setCategories(res.data)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (categoryId) params.append('category', categoryId)
      if (search) params.append('search', search)
      if (priceFilter.minPrice) params.append('minPrice', priceFilter.minPrice)
      if (priceFilter.maxPrice) params.append('maxPrice', priceFilter.maxPrice)

      const res = await api.get(`/products?${params}`)
      setProducts(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/favorites')
      setFavorites(res.data.map(f => f.product_id))
    } catch (e) {
      console.error(e)
    }
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
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Поиск..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="input"
      />

      <CategoryFilter
        categories={categories}
        selected={categoryId}
        onSelect={setCategoryId}
      />

      <PriceFilter onApply={setPriceFilter} />

      {loading ? (
        <div className="loading">Загрузка...</div>
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