package com.kanban.shared.domain.exception;

import com.kanban.shared.domain.exception.ResourceNotFoundException;


public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
