package com.kanban.shared.interfaces.handler;

import com.kanban.shared.domain.exception.ResourceNotFoundException;
import com.kanban.shared.domain.exception.ValidationException;
import com.kanban.shared.domain.exception.*;
import com.kanban.shared.interfaces.response.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final String REQUEST_ID_HEADER = "X-Request-ID";

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        log.error("Resource not found: {} - RequestId: {}", ex.getMessage(), getRequestId(request));
        ErrorResponse errorResponse = ErrorResponse.of(
                "NOT_FOUND",
                ex.getMessage(),
                getRequestPath(request),
                HttpStatus.NOT_FOUND.value(),
                getRequestId(request)
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(ValidationException ex, WebRequest request) {
        log.error("Validation error: {} - RequestId: {}", ex.getMessage(), getRequestId(request));
        ErrorResponse errorResponse = ErrorResponse.of(
                "VALIDATION_ERROR",
                ex.getMessage(),
                getRequestPath(request),
                HttpStatus.BAD_REQUEST.value(),
                getRequestId(request)
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex, WebRequest request) {
        log.error("Authentication failed: {} - RequestId: {}", ex.getMessage(), getRequestId(request));
        ErrorResponse errorResponse = ErrorResponse.of(
                "AUTHENTICATION_FAILED",
                "Invalid credentials",
                getRequestPath(request),
                HttpStatus.UNAUTHORIZED.value(),
                getRequestId(request)
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        log.error("Access denied: {} - RequestId: {}", ex.getMessage(), getRequestId(request));
        ErrorResponse errorResponse = ErrorResponse.of(
                "ACCESS_DENIED",
                "Access denied",
                getRequestPath(request),
                HttpStatus.FORBIDDEN.value(),
                getRequestId(request)
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex, WebRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        log.error("Validation errors: {} - RequestId: {}", errors, getRequestId(request));
        ErrorResponse errorResponse = ErrorResponse.of(
                "VALIDATION_ERROR",
                "Validation failed",
                getRequestPath(request),
                HttpStatus.BAD_REQUEST.value(),
                errors
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex, WebRequest request) {
        log.error("Invalid request body: {} - RequestId: {}", ex.getMessage(), getRequestId(request));
        ErrorResponse errorResponse = ErrorResponse.of(
                "BAD_REQUEST",
                "Invalid request body",
                getRequestPath(request),
                HttpStatus.BAD_REQUEST.value(),
                getRequestId(request)
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<ErrorResponse> handleMissingServletRequestPartException(MissingServletRequestPartException ex, WebRequest request) {
        log.error("Missing request part: {} - RequestId: {}", ex.getMessage(), getRequestId(request));
        ErrorResponse errorResponse = ErrorResponse.of(
                "BAD_REQUEST",
                "Required part '" + ex.getRequestPartName() + "' is not present",
                getRequestPath(request),
                HttpStatus.BAD_REQUEST.value(),
                getRequestId(request)
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, WebRequest request) {
        log.error("Unexpected error: {} - RequestId: {}", ex.getMessage(), getRequestId(request), ex);
        ErrorResponse errorResponse = ErrorResponse.of(
                "INTERNAL_SERVER_ERROR",
                "An unexpected error occurred",
                getRequestPath(request),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                getRequestId(request)
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    private String getRequestId(WebRequest request) {
        String requestId = request.getHeader(REQUEST_ID_HEADER);
        return requestId != null ? requestId : UUID.randomUUID().toString();
    }

    private String getRequestPath(WebRequest request) {
        return request.getDescription(false);
    }
} 
