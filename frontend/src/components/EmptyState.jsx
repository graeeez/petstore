import PropTypes from 'prop-types'
import { Typography, Button, Paper } from '@mui/material'
import SearchOffIcon from '@mui/icons-material/SearchOff'

/**
 * Empty state component shown when no listings match the current filters
 */
export default function EmptyState({ filters = {} }) {
  const hasFilters = Object.values(filters).some(v => v !== null && v !== undefined)

  const handleClearFilters = () => {
    // Trigger filter reset (passed via prop in parent)
    window.location.reload()
  }

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 7,
        px: 3,
        borderRadius: 3,
        backgroundColor: 'grey.50',
        border: '1px dashed',
        borderColor: 'divider',
        textAlign: 'center',
      }}
    >
      <SearchOffIcon sx={{ fontSize: 72, color: 'text.disabled', mb: 1.5 }} />
      
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
        {hasFilters ? 'No pets match your filters' : 'No pets available'}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 440 }}>
        {hasFilters
          ? 'Try adjusting your filters or clearing them to see all available pets.'
          : 'There are currently no pets available. Please check back soon!'}
      </Typography>

      {hasFilters && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleClearFilters}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Clear All Filters
        </Button>
      )}
    </Paper>
  )
}

EmptyState.propTypes = {
  filters: PropTypes.object,
}
