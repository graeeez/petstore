import PropTypes from 'prop-types'
import { Box, Typography, Button } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

/**
 * Error state component with a sleek, modern aesthetic
 */
export default function ErrorState({ error, onRetry }) {
  const errorMessage = error?.message || 'Connection interrupted'
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 10,
        px: 3,
        textAlign: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.02)',
        borderRadius: 6,
        border: '1px solid rgba(239, 68, 68, 0.1)',
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: 4,
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 40, color: '#EF4444' }} />
      </Box>

      <Typography variant="h5" sx={{ mb: 1, fontWeight: 800, color: '#991B1B' }}>
        Service temporarily unavailable
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, lineHeight: 1.6 }}>
        {errorMessage}. We&apos;re currently experiencing higher than usual traffic or a temporary network issue.
      </Typography>

      <Button
        variant="contained"
        color="error"
        onClick={onRetry}
        sx={{ 
          px: 6, 
          py: 1.5, 
          borderRadius: 3,
          boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.2)',
        }}
      >
        Try Again
      </Button>
    </Box>
  )
}

ErrorState.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
    errors: PropTypes.arrayOf(
      PropTypes.shape({
        code: PropTypes.string,
        message: PropTypes.string,
        field: PropTypes.string,
      })
    ),
  }),
  onRetry: PropTypes.func.isRequired,
}
