import { useMemo, useState, useRef, useEffect } from 'react'
import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Container,
  Box,
  CircularProgress,
  Pagination,
  Stack,
  LinearProgress,
  Typography,
  Grid,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
  Divider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import listingService from '../services/listingService'
import { useListingQueryKey } from '../hooks/useListingQueryKey'
import ListingGrid from '../components/ListingGrid'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import FilterPanel from '../components/FilterPanel'
import SortDropdown from '../components/SortDropdown'
import ListingForm from '../components/ListingForm'

/**
 * Main listing page component
 * Displays available pet listings with searching, filtering, sorting, and pagination
 * Features a centered layout with top-aligned controls
 */
export default function ListingPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const limit = 20
  const [filters, setFilters] = useState({
    category: null,
    priceMin: null,
    priceMax: null,
  })
  const [sort, setSort] = useState({ sortBy: 'price', sortOrder: 'asc' })
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const searchTimeoutRef = useRef(null)

  // CRUD State
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingListing, setEditingListing] = useState(null)
  const [viewingListing, setViewingListing] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [detailsImageIndex, setDetailsImageIndex] = useState(0)
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' })

  // Handle search debouncing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(0)
    }, 500)
    return () => clearTimeout(searchTimeoutRef.current)
  }, [search])

  // Build query parameters
  const queryParams = useMemo(() => {
    return Object.entries({
      page,
      limit,
      ...filters,
      ...sort,
      search: debouncedSearch,
      available: true,
    }).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value
      }
      return acc
    }, {})
  }, [page, limit, filters, sort, debouncedSearch])

  // Fetch listings using React Query
  const { data, isPending, isFetching, isError, error } = useQuery({
    queryKey: useListingQueryKey.withParams(queryParams),
    queryFn: () => listingService.getListings(queryParams),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newListing) => listingService.createListing(newListing),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: useListingQueryKey.all() })
      handleCloseForm()
      showNotification('Listing created successfully!')
    },
    onError: (err) => showNotification(err.message || 'Failed to create listing', 'error'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => listingService.updateListing(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: useListingQueryKey.all() })
      handleCloseForm()
      showNotification('Listing updated successfully!')
    },
    onError: (err) => showNotification(err.message || 'Failed to update listing', 'error'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => listingService.deleteListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: useListingQueryKey.all() })
      showNotification('Listing deleted successfully!')
    },
    onError: (err) => showNotification(err.message || 'Failed to delete listing', 'error'),
  })

  // Handlers
  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPage(0)
  }

  const handleSortChange = (newSort) => {
    setSort(newSort)
    setPage(0)
  }

  const handleOpenCreateForm = () => {
    setEditingListing(null)
    setIsFormOpen(true)
  }

  const handleOpenEditForm = (listing) => {
    setEditingListing(listing)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingListing(null)
  }

  const handleOpenDetails = (listing) => {
    setViewingListing(listing)
    setDetailsImageIndex(0)
    setIsDetailsOpen(true)
  }

  const handleCloseDetails = () => {
    setIsDetailsOpen(false)
    setViewingListing(null)
    setDetailsImageIndex(0)
  }

  const handleFormSubmit = (formData) => {
    if (editingListing) {
      updateMutation.mutate({ id: editingListing.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      deleteMutation.mutate(id)
    }
  }

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity })
  }

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  // Extract data from response
  const listings = data?.data?.items || []
  const pagination = data?.data?.pagination || { limit: 20, totalPages: 0 }
  const totalElements = data?.data?.pagination?.totalElements || listings.length

  // Helper to resolve image URL candidates for the details dialog (Matches ListingCard logic)
  const getResolvedImageCandidates = (listing) => {
    if (!listing) return []

    const specificImages = {
      'Golden Retriever': 'https://images.unsplash.com/photo-1611250282006-4484dd3fba6b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z29sZGVuJTIwcmV0cmlldmVyfGVufDB8fDB8fHww',
      'Labrador Mix': 'https://images.unsplash.com/photo-1565313753908-7b1da784e4f1?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFicmFkb3IlMjBwdXBweXxlbnwwfHwwfHx8MA%3D%3D',
      'Amazon Parrot': 'https://images.unsplash.com/photo-1734923647557-5959174e9c2c?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGFtYXpvbiUyMHBhcnJvdHxlbnwwfHwwfHx8MA%3D%3D',
      'Goldfish': 'https://images.unsplash.com/photo-1625369708811-65ebfc5ca632?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z29sZGZpc2h8ZW58MHx8MHx8fDA%3D',
      'Siamese Kitten': 'https://images.unsplash.com/photo-1669095658634-2a5d9fae6d64?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2lhbWVzZXxlbnwwfHwwfHx8MA%3D%3D',
    }

    const placeholders = {
      DOGS: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1200',
      CATS: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=1200',
      BIRDS: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&q=80&w=1200',
      FISHES: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&q=80&w=1200',
    }

    const candidates = [
      specificImages[listing.name],
      listing.imageUrl,
      placeholders[listing.category],
      placeholders.DOGS,
    ].filter(Boolean)

    return [...new Set(candidates)]
  }

  const detailsImageCandidates = viewingListing ? getResolvedImageCandidates(viewingListing) : []
  const detailsImageSrc =
    detailsImageCandidates[Math.min(detailsImageIndex, Math.max(detailsImageCandidates.length - 1, 0))] || ''

  const handleDetailsImageError = () => {
    if (detailsImageIndex < detailsImageCandidates.length - 1) {
      setDetailsImageIndex((current) => current + 1)
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 }, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Sleek Hero Section with Flat Palette */}
      <Box
        sx={{
          mb: 6,
          p: { xs: 4, md: 10 },
          width: '100%',
          borderRadius: 2,
          backgroundColor: '#2d5a3d',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(45, 90, 61, 0.2)',
        }}
      >
        <Typography variant="h2" component="h1" sx={{ mt: 0, mb: 2, fontWeight: 900, fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
          Pet Discovery <span style={{ color: '#d4a017' }}>Hub</span>
        </Typography>
        <Typography variant="h6" sx={{ mb: 6, opacity: 0.9, maxWidth: 700, fontWeight: 400, lineHeight: 1.6 }}>
          Discover your next lifelong companion in our premium, curated collection of extraordinary pets.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', maxWidth: 800, zIndex: 1 }}>
          <TextField
            fullWidth
            placeholder="Search for your perfect companion..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 64,
                fontSize: '1.1rem',
                paddingLeft: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                '& fieldset': { border: 'none' },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 0 0 4px rgba(212, 160, 23, 0.3)',
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.75rem' }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateForm}
            sx={{
              height: 64,
              px: 6,
              fontSize: '1.1rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              borderRadius: 1,
              boxShadow: '0 20px 25px -5px rgba(212, 160, 23, 0.3)',
            }}
          >
            Add New Pet
          </Button>
        </Stack>
      </Box>

      <Box sx={{ width: '100%', maxWidth: 1400 }}>
        {/* Refined Controls Bar */}
        <Grid container spacing={3} sx={{ mb: 6 }} justifyContent="center">
          <Grid item xs={12} lg={10}>
            <Paper 
              sx={{ 
                p: 2.5, 
                borderRadius: 2, 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                gap: 4, 
                justifyContent: 'center', 
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(45, 90, 61, 0.1)',
              }}
            >
              <FilterPanel onFiltersChange={handleFilterChange} isCompact />
              <SortDropdown onSortChange={handleSortChange} isCompact />
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            {totalElements} Extraordinary Pets
          </Typography>
          {debouncedSearch && (
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
              Showing curated results for &quot;{debouncedSearch}&quot;
            </Typography>
          )}
        </Box>

        {isPending && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress size={40} />
          </Box>
        )}

        {isFetching && !isPending && (
          <Box sx={{ mb: 2, borderRadius: 999, overflow: 'hidden' }}>
            <LinearProgress sx={{ height: 6 }} />
          </Box>
        )}

        {isError && <ErrorState error={error} onRetry={() => queryClient.invalidateQueries({ queryKey: useListingQueryKey.all() })} />}

        {!isPending && !isError && listings.length === 0 && <EmptyState filters={filters} onReset={() => { setFilters({ category: null, priceMin: null, priceMax: null }); setSearch(''); }} />}

        {!isPending && !isError && listings.length > 0 && (
          <Box>
            <ListingGrid 
              listings={listings} 
              onEdit={handleOpenEditForm} 
              onDelete={handleDelete} 
              onViewDetails={handleOpenDetails}
            />

            {pagination.totalPages > 1 && (
              <Stack sx={{ display: 'flex', alignItems: 'center', mt: 4, mb: 6 }}>
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
          </Box>
        )}
      </Box>

      {/* Details Dialog */}
      <Dialog 
        open={isDetailsOpen} 
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
      >
        {viewingListing && (
          <Box>
            <Box sx={{ position: 'relative', height: 450 }}>
              <img 
                src={detailsImageSrc}
                alt={viewingListing.name}
                onError={handleDetailsImageError}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <IconButton 
                onClick={handleCloseDetails}
                sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'white' } }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <DialogContent sx={{ p: 6 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#d4a017', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {viewingListing.category}
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#1f4d31' }}>{viewingListing.name}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block' }}>Investment</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#2d5a3d' }}>${Number(viewingListing.price).toLocaleString()}</Typography>
                </Box>
              </Stack>
              
              <Divider sx={{ mb: 4 }} />
              
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>Biography</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: '1.1rem' }}>
                {viewingListing.description || 'This companion is currently awaiting a full biography. Rest assured, they are exceptional in every way and looking forward to meeting their new lifelong family.'}
              </Typography>
              
              <Box sx={{ mt: 6 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={() => { handleCloseDetails(); handleOpenEditForm(viewingListing); }}
                  sx={{ py: 2, fontWeight: 800, borderRadius: 2 }}
                >
                  Edit Listing
                </Button>
              </Box>
            </DialogContent>
          </Box>
        )}
      </Dialog>

      {/* CRUD Dialog */}
      <Dialog 
        open={isFormOpen} 
        onClose={handleCloseForm}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editingListing ? 'Edit Pet Listing' : 'Add New Pet to Catalog'}
          <IconButton onClick={handleCloseForm}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ListingForm 
            initialData={editingListing} 
            onSubmit={handleFormSubmit} 
            onCancel={handleCloseForm}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%', borderRadius: 2 }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}
