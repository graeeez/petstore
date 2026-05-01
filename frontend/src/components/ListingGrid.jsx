import PropTypes from 'prop-types'
import { Grid, Box } from '@mui/material'
import ListingCard from './ListingCard'

/**
 * Grid component that displays listing cards
 * Responsive layout with MUI Grid
 */
export default function ListingGrid({ listings = [] }) {
  return (
    <Box sx={{ mb: 5 }}>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {listings.map(listing => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={listing.id}>
            <ListingCard listing={listing} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

ListingGrid.propTypes = {
  listings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      availability: PropTypes.bool.isRequired,
      imageUrl: PropTypes.string,
      description: PropTypes.string,
    })
  ),
}
