package com.pastoral.petstore.listing.model;

/**
 * Pet category enumeration.
 * Defines valid pet categories for the Petstore catalog.
 */
public enum PetCategory {
    DOGS("Dogs"),
    CATS("Cats"),
    BIRDS("Birds"),
    FISHES("Fishes");

    private final String displayName;

    PetCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    /**
     * Parse string value to PetCategory enum
     */
    public static PetCategory fromString(String value) {
        try {
            return PetCategory.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            return null;
        }
    }

    /**
     * Check if category is valid
     */
    public static boolean isValid(String value) {
        return fromString(value) != null;
    }
}
