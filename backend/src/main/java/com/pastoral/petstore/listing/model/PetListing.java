package com.pastoral.petstore.listing.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Pet listing entity mapped to pet_listings table.
 * Represents a single pet available for sale in the e-commerce catalog.
 */
@Entity
@Table(name = "pet_listings", indexes = {
    @Index(name = "idx_category_availability", columnList = "category, availability"),
    @Index(name = "idx_price_availability", columnList = "price, availability"),
    @Index(name = "idx_created_at", columnList = "created_at DESC"),
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PetListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private PetCategory category;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Boolean availability;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Check if listing is active (not soft-deleted)
     */
    public boolean isActive() {
        return deletedAt == null;
    }

    /**
     * Soft delete the listing
     */
    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }

    /**
     * Restore a soft-deleted listing
     */
    public void restore() {
        this.deletedAt = null;
    }

    /**
     * Convert to DTO for API response (excludes sensitive fields)
     */
    public PetListingSummary toSummary() {
        return PetListingSummary.builder()
            .id(this.id)
            .name(this.name)
            .category(this.category.toString())
            .price(this.price)
            .availability(this.availability)
            .description(this.description)
            .imageUrl(this.imageUrl)
            .createdAt(this.createdAt)
            .updatedAt(this.updatedAt)
            .build();
    }
}
