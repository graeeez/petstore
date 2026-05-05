package com.pastoral.petstore.listing.service;

import com.pastoral.petstore.common.ListingException;
import com.pastoral.petstore.listing.model.PetCategory;
import com.pastoral.petstore.listing.model.PetListing;
import com.pastoral.petstore.listing.model.PetListingRequest;
import com.pastoral.petstore.listing.model.PetListingSummary;
import com.pastoral.petstore.listing.repository.ListingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

/**
 * Service layer for pet listing business logic.
 * Handles filtering, sorting, pagination, and availability checks.
 * Enforces validation rules and data access boundaries.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ListingService {

    private static final int MAX_PAGE_SIZE = 100;
    private static final int DEFAULT_PAGE_SIZE = 20;
    private static final String SORT_BY_PRICE = "price";
    private static final String SORT_BY_CREATED_AT = "createdAt";
    private static final String SORT_ORDER_ASC = "asc";
    private static final String SORT_ORDER_DESC = "desc";

    private final ListingRepository listingRepository;

    /**
     * Get listings with optional filtering and pagination
     */
    public Page<PetListingSummary> getListings(
        String category,
        BigDecimal priceMin,
        BigDecimal priceMax,
        Boolean available,
        String search,
        String sortBy,
        String sortOrder,
        Integer page,
        Integer limit) {

        log.debug("Fetching listings: category={}, priceMin={}, priceMax={}, available={}, search={}, sortBy={}, sortOrder={}, page={}, limit={}",
            category, priceMin, priceMax, available, search, sortBy, sortOrder, page, limit);

        // Validate input parameters
        validateFilterParameters(category, priceMin, priceMax, page, limit);

        // Build sort order
        Sort sort = buildSort(sortBy, sortOrder);

        // Create pageable
        Pageable pageable = PageRequest.of(
            page != null ? page : 0,
            Math.min(limit != null && limit > 0 ? limit : DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE),
            sort
        );

        // Build specification for flexible filtering
        Specification<PetListing> spec = buildSpecification(category, priceMin, priceMax, available, search);

        // Execute query
        Page<PetListing> results = listingRepository.findAll(spec, pageable);

        // Map to DTOs (excludes sensitive fields)
        return results.map(PetListing::toSummary);
    }

    /**
     * Get a single listing by ID if available
     */
    public PetListingSummary getListing(Long id) {
        log.debug("Fetching listing: id={}", id);

        PetListing listing = getPetListing(id);
        return listing.toSummary();
    }

    /**
     * Create a new pet listing
     */
    @Transactional
    public PetListingSummary createListing(PetListingRequest request) {
        log.info("Creating new pet listing: {}", request.getName());

        validateCategory(request.getCategory());

        PetListing listing = PetListing.builder()
            .name(request.getName())
            .category(PetCategory.fromString(request.getCategory()))
            .price(request.getPrice())
            .availability(request.getAvailability())
            .description(request.getDescription())
            .imageUrl(request.getImageUrl())
            .build();

        PetListing savedListing = listingRepository.save(listing);
        log.info("Created pet listing with ID: {}", savedListing.getId());

        return savedListing.toSummary();
    }

    /**
     * Update an existing pet listing
     */
    @Transactional
    public PetListingSummary updateListing(Long id, PetListingRequest request) {
        log.info("Updating pet listing ID: {}", id);

        PetListing listing = getPetListing(id);
        validateCategory(request.getCategory());

        listing.setName(request.getName());
        listing.setCategory(PetCategory.fromString(request.getCategory()));
        listing.setPrice(request.getPrice());
        listing.setAvailability(request.getAvailability());
        listing.setDescription(request.getDescription());
        listing.setImageUrl(request.getImageUrl());

        PetListing updatedListing = listingRepository.save(listing);
        log.info("Updated pet listing ID: {}", updatedListing.getId());

        return updatedListing.toSummary();
    }

    /**
     * Delete a pet listing (soft delete)
     */
    @Transactional
    public void deleteListing(Long id) {
        log.info("Deleting pet listing ID: {}", id);

        PetListing listing = getPetListing(id);
        listing.softDelete();
        listingRepository.save(listing);

        log.info("Soft deleted pet listing ID: {}", id);
    }

    /**
     * Helper to get a pet listing or throw exception
     */
    private PetListing getPetListing(Long id) {
        return listingRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ListingException(
                "Listing not found: " + id,
                "LISTING_NOT_FOUND",
                org.springframework.http.HttpStatus.NOT_FOUND
            ));
    }

    /**
     * Helper to validate category
     */
    private void validateCategory(String category) {
        if (!PetCategory.isValid(category)) {
            throw ListingException.invalidCategory(category);
        }
    }

    /**
     * Validate input filter parameters
     */
    private void validateFilterParameters(String category, BigDecimal priceMin, BigDecimal priceMax, Integer page, Integer limit) {
        // Validate category
        if (category != null && !category.isEmpty()) {
            validateCategory(category);
        }

        // Validate price range
        if (priceMin != null && priceMax != null && priceMin.compareTo(priceMax) > 0) {
            throw ListingException.invalidPriceRange(priceMin.doubleValue(), priceMax.doubleValue());
        }

        // Validate price values are positive
        if (priceMin != null && priceMin.compareTo(BigDecimal.ZERO) < 0) {
            throw ListingException.invalidPriceRange(priceMin.doubleValue(), null);
        }

        if (priceMax != null && priceMax.compareTo(BigDecimal.ZERO) < 0) {
            throw ListingException.invalidPriceRange(null, priceMax.doubleValue());
        }

        // Validate pagination
        if (page != null && page < 0) {
            throw ListingException.invalidPagination("Page must be >= 0");
        }

        if (limit != null && limit <= 0) {
            throw ListingException.invalidPagination("Limit must be > 0");
        }

        if (limit != null && limit > MAX_PAGE_SIZE) {
            throw ListingException.invalidPagination("Limit cannot exceed " + MAX_PAGE_SIZE);
        }
    }

    /**
     * Build sort specification
     */
    private Sort buildSort(String sortBy, String sortOrder) {
        String field = SORT_BY_PRICE;
        Sort.Direction direction = Sort.Direction.ASC;

        if (sortBy != null) {
            if (SORT_BY_CREATED_AT.equalsIgnoreCase(sortBy)) {
                field = SORT_BY_CREATED_AT;
            }
        }

        if (sortOrder != null && SORT_ORDER_DESC.equalsIgnoreCase(sortOrder)) {
            direction = Sort.Direction.DESC;
        }

        return Sort.by(direction, field);
    }

    /**
     * Build JPA specification for flexible filtering
     */
    private Specification<PetListing> buildSpecification(
        String category,
        BigDecimal priceMin,
        BigDecimal priceMax,
        Boolean available,
        String search) {

        return (root, query, cb) -> {
            var predicates = new java.util.ArrayList<>();

            // Active listings only (soft delete)
            predicates.add(cb.isNull(root.get("deletedAt")));

            // Available filter
            if (available != null && available) {
                predicates.add(cb.equal(root.get("availability"), true));
            }

            // Category filter
            if (category != null && !category.isEmpty()) {
                predicates.add(cb.equal(root.get("category"), PetCategory.fromString(category)));
            }

            // Price range filters
            if (priceMin != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), priceMin));
            }

            if (priceMax != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), priceMax));
            }

            // Search filter (name or description)
            if (search != null && !search.trim().isEmpty()) {
                String pattern = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("name")), pattern),
                    cb.like(cb.lower(root.get("description")), pattern)
                ));
            }

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }
}
