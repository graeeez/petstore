package com.pastoral.petstore.listing.repository;

import com.pastoral.petstore.listing.model.PetCategory;
import com.pastoral.petstore.listing.model.PetListing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

/**
 * Repository for pet listing persistence operations.
 * Handles database queries and filtering for pet listings.
 */
@Repository
public interface ListingRepository extends JpaRepository<PetListing, Long>, JpaSpecificationExecutor<PetListing> {

    /**
     * Find active (non-deleted) listings by category
     */
    Page<PetListing> findByCategoryAndDeletedAtIsNull(PetCategory category, Pageable pageable);

    /**
     * Find available listings
     */
    Page<PetListing> findByAvailabilityTrueAndDeletedAtIsNull(Pageable pageable);

    /**
     * Find active listings by category and availability
     */
    Page<PetListing> findByCategoryAndAvailabilityAndDeletedAtIsNull(
        PetCategory category, Boolean availability, Pageable pageable);

    /**
     * Find active listings by price range
     */
    Page<PetListing> findByPriceBetweenAndDeletedAtIsNull(
        BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    /**
     * Generic specification-based query for flexible filtering
     */
    Page<PetListing> findAll(Specification<PetListing> spec, Pageable pageable);

    /**
     * Find a listing by ID if it's active
     */
    Optional<PetListing> findByIdAndDeletedAtIsNull(Long id);

    /**
     * Count active listings
     */
    long countByDeletedAtIsNull();

    /**
     * Count available active listings
     */
    long countByAvailabilityTrueAndDeletedAtIsNull();
}
