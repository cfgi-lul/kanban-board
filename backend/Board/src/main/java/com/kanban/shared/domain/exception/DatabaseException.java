package com.kanban.shared.domain.exception;


/**
 * Exception thrown when database operations fail
 */
public class DatabaseException extends RuntimeException {
    
    public DatabaseException(String message) {
        super(message);
    }
    
    public DatabaseException(String message, Throwable cause) {
        super(message, cause);
    }
} 
