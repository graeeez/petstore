import apiClient from './apiClient'

/**
 * Listing service for API communication
 * Handles GET requests to /pastoral/listings endpoint
 */
export const listingService = {
  /**
   * Fetch listings with optional filters and pagination
   * @param {Object} params - Query parameters
   * @param {string} params.category - Filter by category (DOGS, CATS, BIRDS, FISHES)
   * @param {number} params.priceMin - Minimum price filter
   * @param {number} params.priceMax - Maximum price filter
   * @param {boolean} params.available - Filter by availability
   * @param {string} params.sortBy - Sort field (price, createdAt, popularity)
   * @param {string} params.sortOrder - Sort order (asc, desc)
   * @param {number} params.page - Page number (0-indexed)
   * @param {number} params.limit - Page size (1-100, default 20)
   * @returns {Promise<Object>} API response with listings data
   */
  getListings: async (params = {}) => {
    try {
      const response = await apiClient.get('/listings', { params })
      return response.data
    } catch (error) {
      throw {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        errors: error.response?.data?.errors || [],
        traceId: error.response?.data?.traceId,
      }
    }
  },

  /**
   * Get a single listing by ID
   * @param {number} id - Listing ID
   * @returns {Promise<Object>} API response with listing data
   */
  getListing: async (id) => {
    try {
      const response = await apiClient.get(`/listings/${id}`)
      return response.data
    } catch (error) {
      throw {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        traceId: error.response?.data?.traceId,
      }
    }
  },
}

export default listingService
