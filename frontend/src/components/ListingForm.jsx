import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Stack,
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material'

const CATEGORIES = [
  { value: 'DOGS', label: 'Dogs' },
  { value: 'CATS', label: 'Cats' },
  { value: 'BIRDS', label: 'Birds' },
  { value: 'FISHES', label: 'Fishes' },
]

export default function ListingForm({ initialData, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'DOGS',
    price: '',
    availability: true,
    description: '',
    imageUrl: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || 'DOGS',
        price: initialData.price || '',
        availability: initialData.availability ?? true,
        description: initialData.description || '',
        imageUrl: initialData.imageUrl || '',
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
      <Stack spacing={4}>
        <TextField
          required
          fullWidth
          label="Companion Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          placeholder="e.g. Royal Golden Retriever"
          InputProps={{ sx: { borderRadius: 3 } }}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
          <TextField
            select
            fullWidth
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            error={!!errors.category}
            helperText={errors.category}
            InputProps={{ sx: { borderRadius: 3 } }}
          >
            {CATEGORIES.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            required
            fullWidth
            label="Investment ($)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            error={!!errors.price}
            helperText={errors.price}
            InputProps={{ 
              sx: { borderRadius: 3 },
              inputProps: { min: 0.01, step: 0.01 } 
            }}
          />
        </Stack>

        <TextField
          fullWidth
          label="Gallery Image URL"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://images.unsplash.com/..."
          InputProps={{ sx: { borderRadius: 3 } }}
        />

        <TextField
          fullWidth
          label="Biography"
          name="description"
          multiline
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe this extraordinary companion's character and temperament..."
          InputProps={{ sx: { borderRadius: 4 } }}
        />

        <Box 
          sx={{ 
            p: 2.5, 
            borderRadius: 4, 
            backgroundColor: 'rgba(45, 90, 61, 0.03)', 
            border: '1px solid rgba(45, 90, 61, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f4d31' }}>Availability Status</Typography>
          <FormControlLabel
            control={
              <Switch
                name="availability"
                checked={formData.availability}
                onChange={handleChange}
                color="secondary"
              />
            }
            label={formData.availability ? 'Available for Acquisition' : 'Currently Unavailable'}
            sx={{ m: 0, color: '#1f4d31' }}
          />
        </Box>

        {errors.submit && (
          <Alert severity="error" sx={{ borderRadius: 3 }}>
            {errors.submit}
          </Alert>
        )}

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 2 }}>
          <Button 
            onClick={onCancel} 
            sx={{ color: 'text.secondary', fontWeight: 700, px: 4 }} 
            disabled={isLoading}
          >
            Discard
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ 
              px: 6, 
              py: 1.5, 
              borderRadius: 3,
              fontWeight: 800,
              boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.2)',
            }}
          >
            {initialData ? 'Commit Changes' : 'Publish Listing'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

ListingForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
}
