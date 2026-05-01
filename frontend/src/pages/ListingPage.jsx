import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  Container,
  Box,
  CircularProgress,
  Pagination,
  Stack,
  LinearProgress,
  Typography,
  Grid,
  Chip,
  Paper,
} from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import PetsIcon from '@mui/icons-material/Pets'
import listingService from '../services/listingService'
import { useListingQueryKey } from '../hooks/useListingQueryKey'
import ListingGrid from '../components/ListingGrid'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import FilterPanel from '../components/FilterPanel'
import SortDropdown from '../components/SortDropdown'

/**
 * Main listing page component
 * Displays available pet listings with filtering, sorting, and pagination
 */
export default function ListingPage() {
  const [page, setPage] = useState(0)
  const limit = 20
  const [filters, setFilters] = useState({
    category: null,
    priceMin: null,
    priceMax: null,
  })
  const [sort, setSort] = useState({ sortBy: 'price', sortOrder: 'asc' })

  // Build query parameters
  const queryParams = useMemo(() => {
    return Object.entries({
      page,
      limit,
      ...filters,
      ...sort,
      available: true,
    }).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value
      }
      return acc
    }, {})
  }, [page, limit, filters, sort])

  // Fetch listings using React Query
  const { data, isPending, isFetching, isError, error } = useQuery({
    queryKey: useListingQueryKey.withParams(queryParams),
    queryFn: () => listingService.getListings(queryParams),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: keepPreviousData,
  })

  // Handle pagination
  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1) // React Pagination is 1-indexed
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPage(0) // Reset to first page
  }

  // Handle sort changes
  const handleSortChange = (newSort) => {
    setSort(newSort)
    setPage(0) // Reset to first page
  }

  // Extract data from response
  const listings = data?.data?.items || []
  const pagination = data?.data?.pagination || { limit: 20, totalPages: 0 }
  const totalElements = data?.data?.pagination?.totalElements || listings.length
  const activeFilterCount = [filters.category, filters.priceMin, filters.priceMax].filter(
    value => value !== null && value !== undefined && value !== ''
  ).length

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, minHeight: '80vh' }}>
      <Box
        sx={{
          mb: 4,
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          background: 'linear-gradient(135deg, #2d5a3d 0%, #3d7a52 100%)',
          border: '1px solid',
          borderColor: 'rgba(255,255,255,0.12)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(45, 90, 61, 0.15)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 280,
            height: 280,
            borderRadius: '50%',
            right: -100,
            top: -120,
            backgroundColor: 'rgba(212, 160, 23, 0.12)',
            filter: 'blur(8px)',
          }}
        />
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h3" component="h1" sx={{ mt: 0, fontWeight: 800, lineHeight: 1.1 }}>
              Pet Discovery Hub
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.95, maxWidth: 600 }}>
              Explore available companions in a modern catalog designed for fast filtering and smooth browsing.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ alignSelf: { md: 'flex-start' } }}>
            <Chip icon={<PetsIcon />} label={`${totalElements} Pets`} sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: 'white', fontWeight: 700 }} />
            <Chip icon={<AutoAwesomeIcon />} label={`${activeFilterCount} Active Filters`} sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: 'white', fontWeight: 700 }} />
          </Stack>
        </Stack>
      </Box>

      <Grid container spacing={3} alignItems="flex-start">
        <Grid item xs={12} md={4} lg={3}>
          <Box sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>
            <Stack spacing={2}>
              <FilterPanel onFiltersChange={handleFilterChange} />
              <SortDropdown onSortChange={handleSortChange} />
            </Stack>
          </Box>
        </Grid>
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: { xs: 2, md: 2.5 },
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
              mb: 2.5,
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ sm: 'center' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Curated Listings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Showing {listings.length} results on this page
                </Typography>
              </Box>
              <Chip
                label={`Page ${page + 1}${pagination.totalPages ? ` of ${pagination.totalPages}` : ''}`}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 700 }}
              />
            </Stack>
          </Paper>

          {/* Initial Loading State */}
          {isPending && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress size={34} />
            </Box>
          )}

          {/* Background Refetch State */}
          {isFetching && !isPending && (
            <Box sx={{ mb: 2, borderRadius: 999, overflow: 'hidden' }}>
              <LinearProgress sx={{ height: 6 }} />
            </Box>
          )}

          {/* Error State */}
          {isError && (
            <ErrorState error={error} />
          )}

          {/* Empty State */}
          {!isPending && !isError && listings.length === 0 && (
            <EmptyState filters={filters} />
          )}

          {/* Listings Grid */}
          {!isPending && !isError && listings.length > 0 && (
            <Paper
              sx={{
                p: { xs: 1.5, md: 2.5 },
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 14px 32px rgba(15, 23, 42, 0.09)',
              }}
            >
              <ListingGrid listings={listings} />

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <Stack sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Pagination
                    count={pagination.totalPages}
                    page={page + 1}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                    size="large"
                  />
                </Stack>
              )}
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  )
}
