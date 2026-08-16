import ProductCard from './ProductCard.jsx'

export default function ProductList({ products, favorites, onToggleFavorite }) {
  if (!products || products.length === 0) {
    return <div className="empty">Ничего не найдено</div>
  }

  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          isFavorite={favorites?.includes(product.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}