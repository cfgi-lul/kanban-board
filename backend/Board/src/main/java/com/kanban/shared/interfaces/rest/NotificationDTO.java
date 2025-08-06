package com.kanban.shared.interfaces.rest;

import com.kanban.user.interfaces.rest.UserDTO;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;




@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NotificationDTO {
    private Long id;
    
    @NotBlank(message = "Notification title is required")
    @Size(min = 1, max = 100, message = "Title must be between 1 and 100 characters")
    private String title;
    
    @NotBlank(message = "Notification message is required")
    @Size(min = 1, max = 500, message = "Message must be between 1 and 500 characters")
    private String message;
    
    @NotBlank(message = "Notification type is required")
    private String type;
    
    private boolean read = false;
    
    private String data; // JSON string for additional notification data
    
    private Long recipientId;
    
    private Long senderId;
    
    private Long taskId;
    
    private Long boardId;
    
    private UserDTO recipient;
    
    private UserDTO sender;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime readAt;
    
    // Constructor for notification creation
    public NotificationDTO(String title, String message, String type, Long recipientId) {
        this.title = title;
        this.message = message;
        this.type = type;
        this.recipientId = recipientId;
    }
    
    // Constructor for notification preview (minimal data)
    public NotificationDTO(Long id, String title, String message, boolean read, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.read = read;
        this.createdAt = createdAt;
    }
    
    // Constructor for full notification response
    public NotificationDTO(Long id, String title, String message, String type, boolean read,
                         String data, Long recipientId, Long senderId, Long taskId, Long boardId,
                         UserDTO recipient, UserDTO sender, LocalDateTime createdAt, LocalDateTime readAt) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.type = type;
        this.read = read;
        this.data = data;
        this.recipientId = recipientId;
        this.senderId = senderId;
        this.taskId = taskId;
        this.boardId = boardId;
        this.recipient = recipient;
        this.sender = sender;
        this.createdAt = createdAt;
        this.readAt = readAt;
    }
} 
