import PropTypes from 'prop-types'
import { Typography, Button, Box } from '@mui/material'
import SearchOffIcon from '@mui/icons-material/SearchOff'

/**
 * Empty state component with a sleek, minimal aesthetic
 */
export default function EmptyState({ filters = {}, onReset }) {
  const hasFilters = Object.values(filters).some(v => v !== null && v !== undefined && v !== '')

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 12,
        px: 3,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          backgroundColor: '#F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 4,
          boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <SearchOffIcon sx={{ fontSize: 60, color: '#94A3B8' }} />
      </Box>
      
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 900, color: '#0F172A' }}>
        {hasFilters ? 'No matches found' : 'Catalogue empty'}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, lineHeight: 1.6 }}>
        {hasFilters
          ? 'We couldn&apos;t find any companions matching your current selection. Try refining your parameters.'
          : 'Our collection is currently undergoing maintenance. Please return shortly to discover new companions.'}
      </Typography>

      {hasFilters && (
        <Button
          variant="outlined"
          color="primary"
          onClick={onReset}
          sx={{ 
            px: 4, 
            py: 1.5, 
            borderRadius: 3, 
            borderWidth: 2,
            '&:hover': { borderWidth: 2 }
          }}
        >
          Reset Selection
        </Button>
      )}
    </Box>
  )
}

EmptyState.propTypes = {
  filters: PropTypes.object,
  onReset: PropTypes.func.isRequired,
}
