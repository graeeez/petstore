import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Box,
  Divider,
  Typography,
  Chip,
  Stack,
} from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'

const CATEGORIES = [
  { value: 'DOGS', label: 'Dogs' },
  { value: 'CATS', label: 'Cats' },
  { value: 'BIRDS', label: 'Birds' },
  { value: 'FISHES', label: 'Fishes' },
]

/**
 * Filter panel component for category, price range, and availability filters
 */
export default function FilterPanel({ onFiltersChange, isCompact = false }) {
  const [category, setCategory] = useState(null)
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const priceChangeTimeoutRef = useRef(null)

  const handleCategoryChange = (cat) => {
    const newCategory = category === cat ? null : cat
    setCategory(newCategory)
    emitFilters(newCategory, priceMin, priceMax)
  }

  const handlePriceChange = (min, max) => {
    setPriceMin(min)
    setPriceMax(max)
    if (priceChangeTimeoutRef.current) {
      clearTimeout(priceChangeTimeoutRef.current)
    }
    priceChangeTimeoutRef.current = setTimeout(() => {
      emitFilters(category, min, max)
      priceChangeTimeoutRef.current = null
    }, 300)
  }

  const handleClearFilters = () => {
    setCategory(null)
    setPriceMin('')
    setPriceMax('')
    emitFilters(null, '', '')
  }

  const emitFilters = (cat, min, max) => {
    onFiltersChange({
      category: cat,
      priceMin: min ? parseFloat(min) : null,
      priceMax: max ? parseFloat(max) : null,
    })
  }

  const hasActiveFilters = category || priceMin || priceMax

  useEffect(() => {
    return () => {
      if (priceChangeTimeoutRef.current) {
        clearTimeout(priceChangeTimeoutRef.current)
      }
    }
  }, [])

  if (isCompact) {
    return (
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
        <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
          {CATEGORIES.map(cat => (
            <Chip
              key={cat.value}
              label={cat.label}
              onClick={() => handleCategoryChange(cat.value)}
              color={category === cat.value ? 'primary' : 'default'}
              variant={category === cat.value ? 'contained' : 'outlined'}
              sx={{ 
                px: 1,
                py: 2,
                fontSize: '0.85rem',
                borderWidth: 2,
                '&:hover': { borderWidth: 2 }
              }}
            />
          ))}
        </Stack>
        
        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, height: 24, alignSelf: 'center' }} />
        
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            type="number"
            placeholder="Min Price"
            size="small"
            value={priceMin}
            onChange={e => handlePriceChange(e.target.value, priceMax)}
            sx={{ 
              width: 120,
              '& .MuiOutlinedInput-root': { borderRadius: 3 }
            }}
          />
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>to</Typography>
          <TextField
            type="number"
            placeholder="Max Price"
            size="small"
            value={priceMax}
            onChange={e => handlePriceChange(priceMin, e.target.value)}
            sx={{ 
              width: 120,
              '& .MuiOutlinedInput-root': { borderRadius: 3 }
            }}
          />
        </Stack>
        
        {hasActiveFilters && (
          <Button 
            size="small" 
            onClick={handleClearFilters} 
            startIcon={<ClearIcon />}
            sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
          >
            Reset
          </Button>
        )}
      </Stack>
    )
  }

  return (
    <Card
      sx={{
        width: '100%',
        borderRadius: 3,
        border: '1px solid rgba(45, 90, 61, 0.1)',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 4px 16px rgba(45, 90, 61, 0.08)',
      }}
    >
      <CardHeader
        title="Filters"
        sx={{
          backgroundColor: 'rgba(45, 90, 61, 0.04)',
          borderBottom: '1px solid',
          borderColor: 'rgba(45, 90, 61, 0.1)',
          '& .MuiCardHeader-title': { fontWeight: 800, fontSize: '1rem', color: '#1f4d31' },
        }}
      />
      <CardContent sx={{ p: 2.5 }}>
        {/* Category Filter */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>
            Category
          </Typography>
          <FormGroup>
            {CATEGORIES.map(cat => (
              <FormControlLabel
                key={cat.value}
                control={
                  <Checkbox
                    checked={category === cat.value}
                    onChange={() => handleCategoryChange(cat.value)}
                  />
                }
                label={cat.label}
                sx={{ my: 0.25 }}
              />
            ))}
          </FormGroup>
        </FormControl>

        <Divider sx={{ my: 2 }} />

        {/* Price Range Filter */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>
            Price Range
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              type="number"
              placeholder="Min"
              size="small"
              value={priceMin}
              onChange={e => handlePriceChange(e.target.value, priceMax)}
              inputProps={{ min: 0, step: 10 }}
              fullWidth
            />
            <TextField
              type="number"
              placeholder="Max"
              size="small"
              value={priceMax}
              onChange={e => handlePriceChange(priceMin, e.target.value)}
              inputProps={{ min: 0, step: 10 }}
              fullWidth
            />
          </Box>
        </FormControl>

        <Divider sx={{ my: 2 }} />

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            startIcon={<ClearIcon />}
            onClick={handleClearFilters}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Clear Filters
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

FilterPanel.propTypes = {
  onFiltersChange: PropTypes.func.isRequired,
  isCompact: PropTypes.bool,
}
