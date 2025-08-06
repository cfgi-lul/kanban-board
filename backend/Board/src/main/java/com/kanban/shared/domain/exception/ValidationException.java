package com.kanban.shared.domain.exception;

import com.kanban.shared.domain.exception.ValidationException;


/**
 * Exception thrown when input validation fails
 */
public class ValidationException extends RuntimeException {
    
    public ValidationException(String message) {
        super(message);
    }
    
    public ValidationException(String message, Throwable cause) {
        super(message, cause);
    }
} 
