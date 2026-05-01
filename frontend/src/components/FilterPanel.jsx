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
export default function FilterPanel({ onFiltersChange }) {
  const [category, setCategory] = useState(null)
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const priceChangeTimeoutRef = useRef(null)

  const handleCategoryChange = (cat) => {
    if (priceChangeTimeoutRef.current) {
      clearTimeout(priceChangeTimeoutRef.current)
      priceChangeTimeoutRef.current = null
    }
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
    if (priceChangeTimeoutRef.current) {
      clearTimeout(priceChangeTimeoutRef.current)
      priceChangeTimeoutRef.current = null
    }
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

  return (
    <Card
      sx={{
        width: '100%',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'rgba(45, 90, 61, 0.1)',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,246,241,0.96) 100%)',
        backdropFilter: 'blur(4px)',
        boxShadow: '0 4px 16px rgba(45, 90, 61, 0.08)',
      }}
    >
      <CardHeader
        title="Filters"
        sx={{
          background: 'linear-gradient(90deg, rgba(45, 90, 61, 0.12) 0%, rgba(212, 160, 23, 0.08) 100%)',
          borderBottom: '2px solid',
          borderColor: 'rgba(45, 90, 61, 0.15)',
          '& .MuiCardHeader-title': { fontWeight: 700, fontSize: '1rem', color: '#2d5a3d' },
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
}
