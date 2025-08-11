package com.kanban.task.interfaces.rest;

import com.kanban.shared.interfaces.rest.CommentDTO;
import com.kanban.shared.interfaces.rest.AttachmentDTO;
import com.kanban.shared.interfaces.rest.LabelDTO;
import com.kanban.user.interfaces.rest.UserDTO;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;




@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskDTO {
    private Long id;
    
    @NotBlank(message = "Task title is required")
    @Size(min = 1, max = 200, message = "Task title must be between 1 and 200 characters")
    private String title;
    
    @Size(max = 1000, message = "Task description must not exceed 1000 characters")
    private String description;
    
    private String priority;
    
    private String status;
    
    private LocalDateTime dueDate;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private Integer position; // Position within the column
    
    private List<CommentDTO> comments;
    
    private List<AttachmentDTO> attachments;
    
    private List<LabelDTO> labels;
    
    private UserDTO createdBy;
    
    private UserDTO assignee;
    
    // Constructor for task preview (minimal data)
    public TaskDTO(Long id, String title) {
        this.id = id;
        this.title = title;
    }
    
    // Constructor for task preview with position
    public TaskDTO(Long id, String title, Integer position) {
        this.id = id;
        this.title = title;
        this.position = position;
    }
    
    // Constructor for task creation
    public TaskDTO(String title, String description, String priority, String status, LocalDateTime dueDate) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.dueDate = dueDate;
        this.position = 0; // Default position
    }
    
    // Constructor for full task response
    public TaskDTO(Long id, String title, String description, String priority, String status, 
                   LocalDateTime dueDate, LocalDateTime createdAt, LocalDateTime updatedAt,
                   Integer position, List<CommentDTO> comments, List<AttachmentDTO> attachments, List<LabelDTO> labels,
                   UserDTO createdBy, UserDTO assignee) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.dueDate = dueDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.position = position;
        this.comments = comments;
        this.attachments = attachments;
        this.labels = labels;
        this.createdBy = createdBy;
        this.assignee = assignee;
    }
}
