package com.pastoral.petstore.listing.controller;

import com.pastoral.petstore.common.ApiResponse;
import com.pastoral.petstore.listing.model.PetListingRequest;
import com.pastoral.petstore.listing.model.PetListingSummary;
import com.pastoral.petstore.listing.service.ListingService;
import jakarta.validation.Valid;
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
 * Handles requests for browsing, filtering, sorting, and managing pet listings.
 */
@Slf4j
@RestController
@RequestMapping("/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;

    /**
     * GET /listings
     * Fetch listings with optional filtering and pagination
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getListings(
        @RequestParam(name = "category", required = false) String category,
        @RequestParam(name = "priceMin", required = false) BigDecimal priceMin,
        @RequestParam(name = "priceMax", required = false) BigDecimal priceMax,
        @RequestParam(name = "available", defaultValue = "true") Boolean available,
        @RequestParam(name = "search", required = false) String search,
        @RequestParam(name = "sortBy", defaultValue = "price") String sortBy,
        @RequestParam(name = "sortOrder", defaultValue = "asc") String sortOrder,
        @RequestParam(name = "page", defaultValue = "0") Integer page,
        @RequestParam(name = "limit", defaultValue = "20") Integer limit) {

        log.info("GET /listings - category={}, priceMin={}, priceMax={}, available={}, search={}, sortBy={}, sortOrder={}, page={}, limit={}",
            category, priceMin, priceMax, available, search, sortBy, sortOrder, page, limit);

        // Fetch listings
        Page<PetListingSummary> results = listingService.getListings(
            category, priceMin, priceMax, available, search, sortBy, sortOrder, page, limit);

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

        return ResponseEntity.ok(response);
    }

    /**
     * GET /listings/{id}
     * Fetch a single listing by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PetListingSummary>> getListing(@PathVariable Long id) {
        log.info("GET /listings/{} - fetching single listing", id);

        PetListingSummary listing = listingService.getListing(id);
        ApiResponse<PetListingSummary> response = ApiResponse.success("Listing retrieved successfully", listing);

        return ResponseEntity.ok(response);
    }

    /**
     * POST /listings
     * Create a new pet listing
     */
    @PostMapping
    public ResponseEntity<ApiResponse<PetListingSummary>> createListing(@Valid @RequestBody PetListingRequest request) {
        log.info("POST /listings - creating new listing: {}", request.getName());

        PetListingSummary listing = listingService.createListing(request);
        ApiResponse<PetListingSummary> response = ApiResponse.success("Listing created successfully", listing);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * PUT /listings/{id}
     * Update an existing pet listing
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PetListingSummary>> updateListing(
        @PathVariable Long id,
        @Valid @RequestBody PetListingRequest request) {
        log.info("PUT /listings/{} - updating listing", id);

        PetListingSummary listing = listingService.updateListing(id, request);
        ApiResponse<PetListingSummary> response = ApiResponse.success("Listing updated successfully", listing);

        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /listings/{id}
     * Delete a pet listing (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteListing(@PathVariable Long id) {
        log.info("DELETE /listings/{} - deleting listing", id);

        listingService.deleteListing(id);
        ApiResponse<Void> response = ApiResponse.success("Listing deleted successfully", null);

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
