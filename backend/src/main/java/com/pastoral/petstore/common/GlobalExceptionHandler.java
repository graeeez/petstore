package com.pastoral.petstore.common;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Global exception handler for all REST controllers.
 * Converts exceptions into structured ApiResponse error envelopes.
 * Enforces consistent error handling across the API.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    private String getTraceId() {
        return UUID.randomUUID().toString();
    }

    /**
     * Handle listing-specific exceptions
     */
    @ExceptionHandler(ListingException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiResponse<?>> handleListingException(ListingException ex, WebRequest request) {
        String traceId = getTraceId();
        log.warn("Listing exception (trace={}): {}", traceId, ex.getMessage());

        ApiResponse<?> response = ApiResponse.builder()
            .status("error")
            .message(ex.getMessage())
            .errors(List.of(ApiError.businessError(ex.getCode(), ex.getMessage())))
            .traceId(traceId)
            .build();

        return new ResponseEntity<>(response, ex.getHttpStatus());
    }

    /**
     * Handle validation errors from @Valid annotations
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiResponse<?>> handleValidationException(MethodArgumentNotValidException ex,
                                                                     WebRequest request) {
        String traceId = getTraceId();
        log.warn("Validation error (trace={}): {}", traceId, ex.getBindingResult().getAllErrors());

        List<ApiError> errors = new ArrayList<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.add(ApiError.validationError(error.getField(), error.getDefaultMessage()))
        );

        ApiResponse<?> response = ApiResponse.builder()
            .status("error")
            .message("Validation failed")
            .errors(errors)
            .traceId(traceId)
            .build();

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle type mismatches in request parameters
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ApiResponse<?>> handleTypeMismatch(MethodArgumentTypeMismatchException ex,
                                                              WebRequest request) {
        String traceId = getTraceId();
        log.warn("Type mismatch (trace={}): parameter {} should be {}", traceId, ex.getName(),
            ex.getRequiredType().getSimpleName());

        ApiError error = ApiError.validationError(ex.getName(),
            "Parameter must be of type " + ex.getRequiredType().getSimpleName());

        ApiResponse<?> response = ApiResponse.builder()
            .status("error")
            .message("Invalid parameter type")
            .errors(List.of(error))
            .traceId(traceId)
            .build();

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle 404 not found
     */
    @ExceptionHandler(NoHandlerFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ApiResponse<?>> handleNotFound(NoHandlerFoundException ex, WebRequest request) {
        String traceId = getTraceId();
        log.debug("Resource not found (trace={}): {}", traceId, ex.getRequestURL());

        ApiResponse<?> response = ApiResponse.builder()
            .status("error")
            .message("Resource not found")
            .traceId(traceId)
            .build();

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    /**
     * Handle all other exceptions as internal server errors
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ApiResponse<?>> handleGeneralException(Exception ex, WebRequest request) {
        String traceId = getTraceId();
        log.error("Unexpected exception (trace={}): {}", traceId, ex.getMessage(), ex);

        ApiResponse<?> response = ApiResponse.builder()
            .status("error")
            .message("Internal server error")
            .errors(List.of(ApiError.systemError("An unexpected error occurred")))
            .traceId(traceId)
            .build();

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
