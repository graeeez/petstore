package com.pastoral.petstore.common;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Custom exception for listing-related errors.
 * Provides specific error codes and HTTP status codes for proper error handling.
 */
@Getter
public class ListingException extends RuntimeException {

    private final String code;
    private final HttpStatus httpStatus;

    public ListingException(String message, String code, HttpStatus httpStatus) {
        super(message);
        this.code = code;
        this.httpStatus = httpStatus;
    }

    /**
     * Invalid category exception
     */
    public static ListingException invalidCategory(String category) {
        return new ListingException(
            "Invalid category: " + category + ". Must be one of: DOGS, CATS, BIRDS, FISHES",
            "INVALID_CATEGORY",
            HttpStatus.BAD_REQUEST
        );
    }

    /**
     * Invalid price range exception
     */
    public static ListingException invalidPriceRange(Double minPrice, Double maxPrice) {
        return new ListingException(
            "Invalid price range: priceMin (" + minPrice + ") must be less than priceMax (" + maxPrice + ")",
            "INVALID_PRICE_RANGE",
            HttpStatus.BAD_REQUEST
        );
    }

    /**
     * Invalid pagination exception
     */
    public static ListingException invalidPagination(String message) {
        return new ListingException(
            message,
            "INVALID_PAGINATION",
            HttpStatus.BAD_REQUEST
        );
    }

    /**
     * Service unavailable exception (database or external dependency)
     */
    public static ListingException serviceUnavailable(String reason) {
        return new ListingException(
            "Service unavailable: " + reason,
            "SERVICE_UNAVAILABLE",
            HttpStatus.SERVICE_UNAVAILABLE
        );
    }

    /**
     * Internal server error exception
     */
    public static ListingException internalError(String message) {
        return new ListingException(
            message,
            "INTERNAL_ERROR",
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}
