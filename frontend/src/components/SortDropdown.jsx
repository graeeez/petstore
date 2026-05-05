import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  Box,
} from '@mui/material'

const SORT_OPTIONS = [
  { value: 'price_asc', label: 'Price: Low to High', sortBy: 'price', sortOrder: 'asc' },
  { value: 'price_desc', label: 'Price: High to Low', sortBy: 'price', sortOrder: 'desc' },
  { value: 'newest', label: 'Newest First', sortBy: 'createdAt', sortOrder: 'desc' },
]

/**
 * Sort dropdown component for reordering listings
 */
export default function SortDropdown({ onSortChange, isCompact = false }) {
  const [value, setValue] = useState('price_asc')

  const handleSortChange = (event) => {
    const newValue = event.target.value
    setValue(newValue)
    const selectedOption = SORT_OPTIONS.find(opt => opt.value === newValue)
    onSortChange({
      sortBy: selectedOption.sortBy,
      sortOrder: selectedOption.sortOrder,
    })
  }

  if (isCompact) {
    return (
      <Box sx={{ minWidth: 200 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="sort-select-label">Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            value={value}
            label="Sort By"
            onChange={handleSortChange}
          >
            {SORT_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
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
        title="Sort By"
        sx={{
          backgroundColor: 'rgba(45, 90, 61, 0.04)',
          borderBottom: '1px solid',
          borderColor: 'rgba(45, 90, 61, 0.1)',
          '& .MuiCardHeader-title': { fontWeight: 800, fontSize: '1rem', color: '#1f4d31' },
        }}
      />
      <CardContent sx={{ p: 2.5 }}>
        <FormControl fullWidth>
          <RadioGroup
            defaultValue="price_asc"
            onChange={handleSortChange}
          >
            {SORT_OPTIONS.map(option => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
                sx={{ my: 0.25 }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </CardContent>
    </Card>
  )
}

SortDropdown.propTypes = {
  onSortChange: PropTypes.func.isRequired,
  isCompact: PropTypes.bool,
}
