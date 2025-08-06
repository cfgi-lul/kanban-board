package com.kanban.shared.interfaces.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.Map;




/**
 * Standardized error response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    private String error;
    private String message;
    private String path;
    private int status;
    private LocalDateTime timestamp;
    private String requestId;
    private Map<String, String> fieldErrors;
    
    public static ErrorResponse of(String error, String message, String path, int status) {
        return new ErrorResponse(error, message, path, status, LocalDateTime.now(), null, null);
    }
    
    public static ErrorResponse of(String error, String message, String path, int status, String requestId) {
        return new ErrorResponse(error, message, path, status, LocalDateTime.now(), requestId, null);
    }
    
    public static ErrorResponse of(String error, String message, String path, int status, Map<String, String> fieldErrors) {
        return new ErrorResponse(error, message, path, status, LocalDateTime.now(), null, fieldErrors);
    }
} 
