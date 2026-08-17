export function formatPrice(price, currency = 'BYN') {
  if (price === undefined || price === null) return '—'
  const num = Number(price)
  if (isNaN(num)) return String(price)
  return num.toLocaleString('ru-RU') + ' ' + (currency || 'BYN')
}
