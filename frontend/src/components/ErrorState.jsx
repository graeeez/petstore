import PropTypes from 'prop-types'
import { Box, Alert, AlertTitle, Typography, Button, Paper } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

/**
 * Error state component shown when API request fails
 */
export default function ErrorState({ error }) {
  const errorMessage = error?.message || 'Failed to load listings'
  const errorDetails = error?.errors || []

  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <Paper
      sx={{
        mb: 4,
        p: 2,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Alert severity="error" icon={<ErrorOutlineIcon />} sx={{ borderRadius: 2 }}>
        <AlertTitle>Error Loading Listings</AlertTitle>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {errorMessage}
        </Typography>
        {errorDetails.length > 0 && (
          <Box sx={{ mb: 1, pl: 2 }}>
            {errorDetails.map((err, idx) => (
              <Typography key={idx} variant="caption" display="block">
                • {err.message}
              </Typography>
            ))}
          </Box>
        )}
        <Button
          size="small"
          variant="outlined"
          color="error"
          onClick={handleRetry}
          sx={{ mt: 1, textTransform: 'none', fontWeight: 600 }}
        >
          Retry
        </Button>
      </Alert>
    </Paper>
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
}
