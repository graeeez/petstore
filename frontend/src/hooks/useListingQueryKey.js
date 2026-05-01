/**
 * React Query hook key generator for listings queries
 * Ensures consistent cache key format for React Query
 */
export const useListingQueryKey = {
  /**
   * Generate query key for listings list
   */
  all: () => ['listings'],

  /**
   * Generate query key for listings with filters
   */
  filtered: (filters = {}) => ['listings', 'filtered', filters],

  /**
   * Generate query key for specific pagination
   */
  paginated: (page, limit) => ['listings', 'paginated', page, limit],

  /**
   * Generate query key for listings with all parameters
   */
  withParams: (params = {}) => ['listings', 'params', params],

  /**
   * Generate query key for single listing
   */
  detail: (id) => ['listings', 'detail', id],
}

export default useListingQueryKey
