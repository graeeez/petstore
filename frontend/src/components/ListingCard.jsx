import PropTypes from 'prop-types'
import { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

/**
 * Individual listing card component with a sleek, premium aesthetic
 */
export default function ListingCard({ listing, onEdit, onDelete, onViewDetails }) {
  const [imageError, setImageError] = useState(false)

  // Get specific image URL for known listings (Restored past links)
  const getListingSpecificImage = () => {
    const specificImages = {
      'Golden Retriever': 'https://images.unsplash.com/photo-1611250282006-4484dd3fba6b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z29sZGVuJTIwcmV0cmlldmVyfGVufDB8fDB8fHww',
      'Labrador Mix': 'https://images.unsplash.com/photo-1565313753908-7b1da784e4f1?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFicmFkb3IlMjBwdXBweXxlbnwwfHwwfHx8MA%3D%3D',
      'Amazon Parrot': 'https://images.unsplash.com/photo-1734923647557-5959174e9c2c?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGFtYXpvbiUyMHBhcnJvdHxlbnwwfHwwfHx8MA%3D%3D',
      'Goldfish': 'https://images.unsplash.com/photo-1625369708811-65ebfc5ca632?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z29sZGZpc2h8ZW58MHx8MHx8fDA%3D',
      'Siamese Kitten': 'https://images.unsplash.com/photo-1669095658634-2a5d9fae6d64?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2lhbWVzZXxlbnwwfHwwfHx8MA%3D%3D',
    }
    return specificImages[listing.name] || null
  }

  const getCategoryPlaceholder = () => {
    const placeholders = {
      DOGS: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800',
      CATS: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
      BIRDS: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&q=80&w=800',
      FISHES: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&q=80&w=800',
    }
    return placeholders[listing.category] || placeholders.DOGS
  }

  const getImageUrl = () => {
    const specificImage = getListingSpecificImage()
    if (specificImage && !imageError) return specificImage
    if (listing.imageUrl && !imageError) return listing.imageUrl
    return getCategoryPlaceholder()
  }

  const handleImageError = () => setImageError(true)

  const handleViewDetails = () => {
    onViewDetails(listing)
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Image with subtle zoom on hover */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 240,
          overflow: 'hidden',
          backgroundColor: '#F1F5F9',
        }}
      >
        <img
          src={getImageUrl()}
          alt={listing.name}
          onError={handleImageError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        
        {/* Availability Badge with Original Green/Error colors */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            padding: '6px 12px',
            borderRadius: '99px',
            backgroundColor: listing.availability ? 'rgba(45, 90, 61, 0.95)' : 'rgba(239, 44, 44, 0.95)',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          {listing.availability ? 'Available' : 'Unavailable'}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3, pb: 1 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#d4a017', // Original Gold
            fontWeight: 800, 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em',
            mb: 1,
            display: 'block'
          }}
        >
          {listing.category}
        </Typography>

        <Typography variant="h5" sx={{ mb: 1, fontWeight: 800, color: '#1f4d31' }}>
          {listing.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {listing.description || 'No description available for this companion.'}
        </Typography>

        <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(45, 90, 61, 0.06)' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block' }}>
            Investment
          </Typography>
          <Typography variant="h4" sx={{ color: '#2d5a3d', fontWeight: 900 }}>
            ${Number(listing.price).toLocaleString()}
          </Typography>
        </Box>
      </CardContent>

      {/* Persistent Action Buttons - No Gradients */}
      <Box sx={{ p: 3, pt: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleViewDetails}
          sx={{ 
            py: 1.5,
            fontWeight: 800,
            borderRadius: 2,
            backgroundColor: '#2d5a3d',
            '&:hover': { backgroundColor: '#1f4d31' }
          }}
        >
          View Full Details
        </Button>
        
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => onEdit(listing)}
            sx={{ 
              borderRadius: 2, 
              color: '#1f4d31', 
              borderColor: '#1f4d31',
              fontWeight: 700,
              '&:hover': { borderColor: '#2d5a3d', bgcolor: 'rgba(45, 90, 61, 0.04)', borderWidth: 1 } 
            }}
          >
            Edit
          </Button>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(listing.id)}
            sx={{ 
              borderRadius: 2, 
              fontWeight: 700,
              '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.04)' }
            }}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Card>
  )
}

ListingCard.propTypes = {
  listing: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    availability: PropTypes.bool.isRequired,
    imageUrl: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onViewDetails: PropTypes.func,
}
