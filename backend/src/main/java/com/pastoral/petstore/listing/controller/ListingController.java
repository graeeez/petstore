package com.pastoral.petstore.listing.controller;

import com.pastoral.petstore.common.ApiResponse;
import com.pastoral.petstore.listing.model.PetListingSummary;
import com.pastoral.petstore.listing.service.ListingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * REST controller for pet listing endpoints.
 * Handles GET /pastoral/listings requests for browsing, filtering, and sorting listings.
 */
@Slf4j
@RestController
@RequestMapping("/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;

    /**
     * GET /pastoral/listings
     * Fetch listings with optional filtering and pagination
     *
     * @param category Filter by pet category (DOGS, CATS, BIRDS, FISHES)
     * @param priceMin Minimum price filter
     * @param priceMax Maximum price filter
     * @param available Filter by availability (default: true)
     * @param sortBy Sort field: "price" or "createdAt" (default: "price")
     * @param sortOrder Sort order: "asc" or "desc" (default: "asc")
     * @param page Page number, 0-indexed (default: 0)
     * @param limit Page size, 1-100 (default: 20)
     * @return ApiResponse containing paginated listings
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getListings(
        @RequestParam(name = "category", required = false) String category,
        @RequestParam(name = "priceMin", required = false) BigDecimal priceMin,
        @RequestParam(name = "priceMax", required = false) BigDecimal priceMax,
        @RequestParam(name = "available", defaultValue = "true") Boolean available,
        @RequestParam(name = "sortBy", defaultValue = "price") String sortBy,
        @RequestParam(name = "sortOrder", defaultValue = "asc") String sortOrder,
        @RequestParam(name = "page", defaultValue = "0") Integer page,
        @RequestParam(name = "limit", defaultValue = "20") Integer limit) {

        log.info("GET /listings - category={}, priceMin={}, priceMax={}, available={}, sortBy={}, sortOrder={}, page={}, limit={}",
            category, priceMin, priceMax, available, sortBy, sortOrder, page, limit);

        try {
            // Fetch listings
            Page<PetListingSummary> results = listingService.getListings(
                category, priceMin, priceMax, available, sortBy, sortOrder, page, limit);

            // Build response with pagination metadata
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("items", results.getContent());
            responseData.put("pagination", Map.of(
                "page", results.getNumber(),
                "limit", results.getSize(),
                "totalElements", results.getTotalElements(),
                "totalPages", results.getTotalPages(),
                "hasMore", results.hasNext()
            ));

            ApiResponse<Map<String, Object>> response = ApiResponse.success(
                "Listings retrieved successfully",
                responseData
            );

            log.debug("Returning {} listings from page {} of {}", 
                results.getNumberOfElements(), results.getNumber(), results.getTotalPages());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error fetching listings", e);
            throw e;
        }
    }

    /**
     * GET /pastoral/listings/{id}
     * Fetch a single listing by ID
     *
     * @param id Listing ID
     * @return ApiResponse containing the listing details
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PetListingSummary>> getListing(@PathVariable Long id) {
        log.info("GET /listings/{} - fetching single listing", id);

        PetListingSummary listing = listingService.getListing(id);
        ApiResponse<PetListingSummary> response = ApiResponse.success("Listing retrieved successfully", listing);

        return ResponseEntity.ok(response);
    }

    /**
     * Health check endpoint for Render deployment
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "message", "Listing service is healthy"));
    }
}
