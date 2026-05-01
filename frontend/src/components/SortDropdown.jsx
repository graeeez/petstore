import PropTypes from 'prop-types'
import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material'

const SORT_OPTIONS = [
  { value: 'price_asc', label: 'Price: Low to High', sortBy: 'price', sortOrder: 'asc' },
  { value: 'price_desc', label: 'Price: High to Low', sortBy: 'price', sortOrder: 'desc' },
  { value: 'newest', label: 'Newest First', sortBy: 'createdAt', sortOrder: 'desc' },
]

/**
 * Sort dropdown component for reordering listings
 */
export default function SortDropdown({ onSortChange }) {
  const handleSortChange = (event) => {
    const selectedOption = SORT_OPTIONS.find(opt => opt.value === event.target.value)
    onSortChange({
      sortBy: selectedOption.sortBy,
      sortOrder: selectedOption.sortOrder,
    })
  }

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
        title="Sort By"
        sx={{
          background: 'linear-gradient(90deg, rgba(45, 90, 61, 0.12) 0%, rgba(212, 160, 23, 0.08) 100%)',
          borderBottom: '2px solid',
          borderColor: 'rgba(45, 90, 61, 0.15)',
          '& .MuiCardHeader-title': { fontWeight: 700, fontSize: '1rem', color: '#2d5a3d' },
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
}
