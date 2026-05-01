package com.pastoral.petstore.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Standardized error detail object for API responses.
 * Used within ApiResponse errors list to provide granular error information.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiError {
    
    /**
     * Error code (e.g., "INVALID_CATEGORY", "INVALID_PRICE_RANGE")
     */
    private String code;
    
    /**
     * User-facing error message
     */
    private String message;
    
    /**
     * Field name that caused the error (optional, for validation errors)
     */
    private String field;
    
    /**
     * Additional error details for debugging
     */
    private String details;
    
    /**
     * Create a validation error
     */
    public static ApiError validationError(String field, String message) {
        return ApiError.builder()
            .code("VALIDATION_ERROR")
            .field(field)
            .message(message)
            .build();
    }
    
    /**
     * Create a business logic error
     */
    public static ApiError businessError(String code, String message) {
        return ApiError.builder()
            .code(code)
            .message(message)
            .build();
    }
    
    /**
     * Create a system error
     */
    public static ApiError systemError(String message) {
        return ApiError.builder()
            .code("SYSTEM_ERROR")
            .message(message)
            .build();
    }
}
