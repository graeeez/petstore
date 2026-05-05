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
   * Create a new listing
   * @param {Object} listingData - The listing data to create
   * @returns {Promise<Object>} API response with the created listing
   */
  createListing: async (listingData) => {
    try {
      const response = await apiClient.post('/listings', listingData)
      return response.data
    } catch (error) {
      throw {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        errors: error.response?.data?.errors || [],
      }
    }
  },

  /**
   * Update an existing listing
   * @param {number} id - Listing ID
   * @param {Object} listingData - The listing data to update
   * @returns {Promise<Object>} API response with the updated listing
   */
  updateListing: async (id, listingData) => {
    try {
      const response = await apiClient.put(`/listings/${id}`, listingData)
      return response.data
    } catch (error) {
      throw {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        errors: error.response?.data?.errors || [],
      }
    }
  },

  /**
   * Delete a listing
   * @param {number} id - Listing ID
   * @returns {Promise<Object>} API response
   */
  deleteListing: async (id) => {
    try {
      const response = await apiClient.delete(`/listings/${id}`)
      return response.data
    } catch (error) {
      throw {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      }
    }
  },
}

export default listingService
