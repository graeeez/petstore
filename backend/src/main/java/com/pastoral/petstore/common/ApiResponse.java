package com.pastoral.petstore.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

/**
 * Standard API response envelope for all Petstore endpoints.
 * Wraps all responses in a consistent structure with status, data, and metadata.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    
    /**
     * Response status: "success", "error", "warning"
     */
    private String status;
    
    /**
     * Response message (optional)
     */
    private String message;
    
    /**
     * Actual response data payload
     */
    private T data;
    
    /**
     * List of errors (if status is "error")
     */
    private List<ApiError> errors;
    
    /**
     * Response timestamp (UTC)
     */
    private Instant timestamp;
    
    /**
     * Request trace ID for debugging
     */
    private String traceId;
    
    /**
     * Build a success response with data
     */
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
            .status("success")
            .data(data)
            .timestamp(Instant.now())
            .build();
    }
    
    /**
     * Build a success response with message and data
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
            .status("success")
            .message(message)
            .data(data)
            .timestamp(Instant.now())
            .build();
    }
    
    /**
     * Build an error response
     */
    public static <T> ApiResponse<T> error(String message, List<ApiError> errors) {
        return ApiResponse.<T>builder()
            .status("error")
            .message(message)
            .errors(errors)
            .timestamp(Instant.now())
            .build();
    }
    
    /**
     * Build an error response with a single error
     */
    public static <T> ApiResponse<T> error(String message, ApiError error) {
        return ApiResponse.<T>builder()
            .status("error")
            .message(message)
            .errors(List.of(error))
            .timestamp(Instant.now())
            .build();
    }
}
