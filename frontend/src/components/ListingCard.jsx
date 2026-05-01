import PropTypes from 'prop-types'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

/**
 * Individual listing card component
 * Displays pet image, name, category, price, and availability
 */
export default function ListingCard({ listing }) {
  const [imageError, setImageError] = useState(false)

  const categoryColors = {
    DOGS: '#d4a017',
    CATS: '#2d5a3d',
    BIRDS: '#d4a017',
    FISHES: '#3d7a52',
  }

  // Get specific image URL for known listings
  const getListingSpecificImage = () => {
    const specificImages = {
      'Golden Retriever': 'https://images.unsplash.com/photo-1611250282006-4484dd3fba6b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z29sZGVuJTIwcmV0cmlldmVyfGVufDB8fDB8fHww',
      'Labrador Mix': 'https://images.unsplash.com/photo-1565313753908-7b1da784e4f1?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFicmFkb3IlMjBwdXBweXxlbnwwfHwwfHx8MA%3Dus',
      'Amazon Parrot': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbQYhoHblQZuzn4FA2HUtE8paXFldGXy6rOA&s',
      'Goldfish': 'https://images.unsplash.com/photo-1625369708811-65ebfc5ca632?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z29sZGZpc2h8ZW58MHx8MHx8fDA%3D',
      'Siamese Kitten': 'https://images.unsplash.com/photo-1669095658634-2a5d9fae6d64?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2lhbWVzZXxlbnwwfHwwfHx8MA%3D%3D',
    }
    return specificImages[listing.name] || null
  }

  // Get placeholder image based on category
  const getCategoryPlaceholder = () => {
    const placeholders = {
      DOGS: 'https://images.unsplash.com/photo-1633586606144-9a6ba1ecf7e1?w=500&h=190&fit=crop&q=80',
      CATS: 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=500&h=190&fit=crop&q=80',
      BIRDS: 'https://images.unsplash.com/photo-1594749073513-b7ecf1c0c71f?w=500&h=190&fit=crop&q=80',
      FISHES: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=190&fit=crop&q=80',
    }
    return placeholders[listing.category] || placeholders.DOGS
  }

  // Determine image URL with fallback chain
  const getImageUrl = () => {
    // First try specific listing image
    const specificImage = getListingSpecificImage()
    if (specificImage && !imageError) {
      return specificImage
    }
    // Then try database imageUrl
    if (listing.imageUrl && !imageError) {
      const url = listing.imageUrl
      if (url.includes('unsplash.com') && !url.includes('w=')) {
        return `${url}?w=500&h=190&fit=crop&q=80`
      }
      return url
    }
    // Finally use category placeholder
    return getCategoryPlaceholder()
  }

  const handleImageError = () => {
    console.warn(`Image failed to load for listing ${listing.id}:`, {
      name: listing.name,
      category: listing.category,
      databaseUrl: listing.imageUrl,
      fallbackUrl: getCategoryPlaceholder(),
    })
    setImageError(true)
  }

  const handleViewDetails = () => {
    // Navigate to detail page (to be implemented)
    console.log('View details for listing:', listing.id)
  }

  const handleAddToCart = () => {
    // Add to cart logic (to be implemented)
    console.log('Add to cart:', listing.id)
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'rgba(45, 90, 61, 0.1)',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(45, 90, 61, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: '#ffffff',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 16px 32px rgba(45, 90, 61, 0.15)',
          borderColor: 'rgba(212, 160, 23, 0.3)',
        },
      }}
    >
      {/* Image */}
      <Box
        sx={{
          width: '100%',
          height: 190,
          backgroundColor: '#f0f0f0',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
            display: 'block',
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.25 }}>
        {/* Category Chip */}
        <Chip
          label={listing.category}
          size="small"
          sx={{
            mb: 1,
            backgroundColor: categoryColors[listing.category] || 'primary.main',
            color: 'white',
            fontWeight: 600,
          }}
        />

        {/* Pet Name */}
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          {listing.name}
        </Typography>

        {/* Availability Status */}
        <Typography
          variant="body2"
          sx={{
            color: listing.availability ? 'success.main' : 'error.main',
            fontWeight: 'bold',
            mb: 1,
          }}
        >
          {listing.availability ? '✓ Available' : '✗ Unavailable'}
        </Typography>

        {/* Description */}
        {listing.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {listing.description}
          </Typography>
        )}

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
          <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700 }}>
            ${listing.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            per pet
          </Typography>
        </Box>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ gap: 1, px: 2.25, pb: 2.25, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          size="small"
          startIcon={<ShoppingCartIcon />}
          onClick={handleAddToCart}
          disabled={!listing.availability}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Add to Cart
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={handleViewDetails}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Details
        </Button>
      </CardActions>
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
}
