package com.kanban.shared.interfaces.rest;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;





@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LabelDTO {
    private Long id;
    
    @NotBlank(message = "Label name is required")
    @Size(min = 1, max = 50, message = "Label name must be between 1 and 50 characters")
    private String name;
    
    @NotBlank(message = "Label color is required")
    @Size(min = 4, max = 7, message = "Color must be a valid hex code (e.g., #FF0000)")
    private String color;
    
    @Size(max = 200, message = "Label description must not exceed 200 characters")
    private String description;
    
    private Long boardId;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Constructor for label creation
    public LabelDTO(String name, String color, String description, Long boardId) {
        this.name = name;
        this.color = color;
        this.description = description;
        this.boardId = boardId;
    }
    
    // Constructor for label preview (minimal data)
    public LabelDTO(Long id, String name, String color) {
        this.id = id;
        this.name = name;
        this.color = color;
    }
    
    // Constructor for full label response
    public LabelDTO(Long id, String name, String color, String description, 
                   Long boardId, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.description = description;
        this.boardId = boardId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
} 
