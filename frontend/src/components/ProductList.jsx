import ProductCard from './ProductCard.jsx'

export default function ProductList({ products, favorites, onToggleFavorite, layout = 'grid' }) {
  if (!products || products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>Ничего не найдено</div>
        <div style={{ fontSize: 13, marginTop: 8, opacity: 0.7 }}>Попробуйте изменить фильтры</div>
      </div>
    )
  }

  if (layout === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {products.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={favorites?.includes(product.id)}
            onToggleFavorite={onToggleFavorite}
            layout="list"
          />
        ))}
      </div>
    )
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 12
    }}>
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          isFavorite={favorites?.includes(product.id)}
          onToggleFavorite={onToggleFavorite}
          layout="grid"
        />
      ))}
    </div>
  )
}
