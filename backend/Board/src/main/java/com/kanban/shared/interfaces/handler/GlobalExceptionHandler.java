package com.kanban.shared.interfaces.handler;

import com.kanban.shared.domain.exception.ResourceNotFoundException;
import com.kanban.shared.domain.exception.ValidationException;
import com.kanban.shared.domain.exception.*;
import com.kanban.shared.interfaces.response.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;




/**
 * Global exception handler to standardize error responses
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {
        String requestId = generateRequestId();
        log.error("Resource not found: {} - RequestId: {}", ex.getMessage(), requestId);
        
        ErrorResponse errorResponse = ErrorResponse.of(
            "NOT_FOUND",
            ex.getMessage(),
            request.getDescription(false),
            HttpStatus.NOT_FOUND.value(),
            requestId
        );
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            ValidationException ex, WebRequest request) {
        String requestId = generateRequestId();
        log.error("Validation error: {} - RequestId: {}", ex.getMessage(), requestId);
        
        ErrorResponse errorResponse = ErrorResponse.of(
            "VALIDATION_ERROR",
            ex.getMessage(),
            request.getDescription(false),
            HttpStatus.BAD_REQUEST.value(),
            requestId
        );
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(
            AuthenticationException ex, WebRequest request) {
        String requestId = generateRequestId();
        log.error("Authentication error: {} - RequestId: {}", ex.getMessage(), requestId);
        
        ErrorResponse errorResponse = ErrorResponse.of(
            "AUTHENTICATION_ERROR",
            ex.getMessage(),
            request.getDescription(false),
            HttpStatus.UNAUTHORIZED.value(),
            requestId
        );
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    @ExceptionHandler(BusinessLogicException.class)
    public ResponseEntity<ErrorResponse> handleBusinessLogicException(
            BusinessLogicException ex, WebRequest request) {
        String requestId = generateRequestId();
        log.error("Business logic error: {} - RequestId: {}", ex.getMessage(), requestId);
        
        ErrorResponse errorResponse = ErrorResponse.of(
            "BUSINESS_LOGIC_ERROR",
            ex.getMessage(),
            request.getDescription(false),
            HttpStatus.UNPROCESSABLE_ENTITY.value(),
            requestId
        );
        
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(errorResponse);
    }

    @ExceptionHandler(DatabaseException.class)
    public ResponseEntity<ErrorResponse> handleDatabaseException(
            DatabaseException ex, WebRequest request) {
        String requestId = generateRequestId();
        log.error("Database error: {} - RequestId: {}", ex.getMessage(), requestId);
        
        ErrorResponse errorResponse = ErrorResponse.of(
            "DATABASE_ERROR",
            "An internal database error occurred",
            request.getDescription(false),
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            requestId
        );
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    @ExceptionHandler(ExternalServiceException.class)
    public ResponseEntity<ErrorResponse> handleExternalServiceException(
            ExternalServiceException ex, WebRequest request) {
        String requestId = generateRequestId();
        log.error("External service error: {} - RequestId: {}", ex.getMessage(), requestId);
        
        ErrorResponse errorResponse = ErrorResponse.of(
            "EXTERNAL_SERVICE_ERROR",
            ex.getMessage(),
            request.getDescription(false),
            HttpStatus.SERVICE_UNAVAILABLE.value(),
            requestId
        );
        
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException ex, WebRequest request) {
        String requestId = generateRequestId();
        log.error("Bean validation error: {} - RequestId: {}", ex.getMessage(), requestId);
        
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            fieldErrors.put(fieldName, errorMessage);
        });
        
        ErrorResponse errorResponse = ErrorResponse.of(
            "VALIDATION_ERROR",
            "Validation failed",
            request.getDescription(false),
            HttpStatus.BAD_REQUEST.value(),
            fieldErrors
        );
        errorResponse.setRequestId(requestId);
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(
            BadCredentialsException ex, WebRequest request) {
        String requestId = generateRequestId();
        log.error("Bad credentials: {} - RequestId: {}", ex.getMessage(), requestId);
        
        ErrorResponse errorResponse = ErrorResponse.of(
            "AUTHENTICATION_ERROR",
            "Invalid username or password",
            request.getDescription(false),
            HttpStatus.UNAUTHORIZED.value(),
            requestId
        );
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(
            AccessDeniedException ex, WebRequest request) {
        String requestId = generateRequestId();
        log.error("Access denied: {} - RequestId: {}", ex.getMessage(), requestId);
        
        ErrorResponse errorResponse = ErrorResponse.of(
            "ACCESS_DENIED",
            "Access denied",
            request.getDescription(false),
            HttpStatus.FORBIDDEN.value(),
            requestId
        );
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex, WebRequest request) {
        String requestId = generateRequestId();
        log.error("Unexpected error: {} - RequestId: {}", ex.getMessage(), requestId, ex);
        
        ErrorResponse errorResponse = ErrorResponse.of(
            "INTERNAL_SERVER_ERROR",
            "An unexpected error occurred",
            request.getDescription(false),
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            requestId
        );
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    private String generateRequestId() {
        return UUID.randomUUID().toString();
    }
} 
