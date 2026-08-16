export const API_URL = import.meta.env.VITE_API_URL || '/api'

export const CURRENCIES = {
  BYN: 'BYN',
  USD: 'USD',
  EUR: 'EUR',
  RUB: 'RUB',
}

export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  SOLD: 'sold',
  ARCHIVED: 'archived',
}

export const MODERATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

export const MAX_IMAGES = {
  REGULAR: 5,
  VIP: 10,
}

export const VIP_DURATION_DAYS = 30