import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axios.js'
import ProductList from '../components/ProductList.jsx'
import SearchBar from '../components/SearchBar.jsx'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState(searchParams.get('q') || '')

  useEffect(() => {
    if (search) {
      setLoading(true)
      api.get(`/products?search=${encodeURIComponent(search)}`)
        .then(res => setProducts(res.data))
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [search])

  const handleSearch = (val) => {
    setSearch(val)
    if (val) setSearchParams({ q: val })
    else setSearchParams({})
  }

  return (
    <div className="container" style={{ paddingTop: 8 }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>🔍 Поиск</h2>
      <SearchBar value={search} onChange={handleSearch} />
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--surface-light)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          Поиск...
        </div>
      ) : search && products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Ничего не найдено</div>
          <div style={{ fontSize: 13, marginTop: 8, opacity: 0.7 }}>Попробуйте другой запрос</div>
        </div>
      ) : (
        <ProductList products={products} favorites={[]} onToggleFavorite={() => {}} layout="list" />
      )}
    </div>
  )
}
