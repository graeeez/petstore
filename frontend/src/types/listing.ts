/**
 * TypeScript type definitions for Pet Listing Page feature
 * Ensures type safety across frontend components
 */

/**
 * Pet category enum
 */
export const PetCategory = {
  DOGS: 'DOGS',
  CATS: 'CATS',
  BIRDS: 'BIRDS',
  FISHES: 'FISHES',
}

/**
 * Pet listing summary - shopper-facing response from API
 */
export class PetListingSummary {
  constructor(data = {}) {
    this.id = data.id
    this.name = data.name
    this.category = data.category
    this.price = data.price
    this.availability = data.availability
    this.description = data.description
    this.imageUrl = data.imageUrl
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  id = null
  name = ''
  category = ''
  price = 0
  availability = false
  description = ''
  imageUrl = ''
  createdAt = null
  updatedAt = null
}

/**
 * Listing filter state for UI
 */
export class ListingFilterState {
  constructor(data = {}) {
    this.category = data.category || null
    this.priceMin = data.priceMin || null
    this.priceMax = data.priceMax || null
    this.available = data.available !== undefined ? data.available : true
  }

  category = null
  priceMin = null
  priceMax = null
  available = true
}

/**
 * Listing sort preference enum
 */
export const ListingSortPreference = {
  PRICE_LOW_TO_HIGH: { sortBy: 'price', sortOrder: 'asc' },
  PRICE_HIGH_TO_LOW: { sortBy: 'price', sortOrder: 'desc' },
  NEWEST_FIRST: { sortBy: 'createdAt', sortOrder: 'desc' },
  POPULARITY: { sortBy: 'popularity', sortOrder: 'desc' },
}

/**
 * Pagination state
 */
export class PaginationState {
  constructor(data = {}) {
    this.page = data.page || 0
    this.limit = data.limit || 20
    this.totalElements = data.totalElements || 0
    this.totalPages = data.totalPages || 0
  }

  page = 0
  limit = 20
  totalElements = 0
  totalPages = 0
}

/**
 * API response wrapper
 */
export class ApiResponse {
  constructor(data = {}) {
    this.status = data.status
    this.message = data.message
    this.data = data.data
    this.errors = data.errors || []
    this.timestamp = data.timestamp
    this.traceId = data.traceId
  }

  status = 'success'
  message = ''
  data = null
  errors = []
  timestamp = null
  traceId = null

  isSuccess() {
    return this.status === 'success'
  }

  isError() {
    return this.status === 'error'
  }
}

/**
 * Listings response with pagination
 */
export class ListingsResponse {
  constructor(data = {}) {
    this.items = data.items || []
    this.pagination = new PaginationState(data.pagination)
  }

  items = []
  pagination = new PaginationState()
}
