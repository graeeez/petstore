package com.pastoral.petstore.listing.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for pet listing responses.
 * Excludes sensitive internal fields (cost, supplier, profit).
 * Used in API responses to shoppers.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PetListingSummary {

    /**
     * Unique listing identifier
     */
    private Long id;

    /**
     * Pet name
     */
    private String name;

    /**
     * Pet category (DOGS, CATS, BIRDS, FISHES)
     */
    private String category;

    /**
     * Retail price for the pet
     */
    private BigDecimal price;

    /**
     * Whether pet is currently available for purchase
     */
    private Boolean availability;

    /**
     * Detailed pet description
     */
    private String description;

    /**
     * URL to pet image
     */
    private String imageUrl;

    /**
     * Listing creation timestamp (UTC)
     */
    private LocalDateTime createdAt;

    /**
     * Listing last updated timestamp (UTC)
     */
    private LocalDateTime updatedAt;
}
