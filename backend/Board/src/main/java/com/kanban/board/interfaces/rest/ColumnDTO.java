package com.kanban.board.interfaces.rest;

import com.kanban.task.interfaces.rest.TaskDTO;
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
public class ColumnDTO {
    private Long id;
    
    @NotBlank(message = "Column name is required")
    @Size(min = 1, max = 50, message = "Column name must be between 1 and 50 characters")
    private String name;
    
    private Integer orderIndex;
    
    private String color;
    
    private Integer taskLimit;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private List<TaskDTO> tasks;
    
    // Constructor for column creation
    public ColumnDTO(String name, Integer orderIndex, String color, Integer taskLimit) {
        this.name = name;
        this.orderIndex = orderIndex;
        this.color = color;
        this.taskLimit = taskLimit;
    }
    
    // Constructor for column preview (minimal data)
    public ColumnDTO(Long id, String name, Integer orderIndex) {
        this.id = id;
        this.name = name;
        this.orderIndex = orderIndex;
    }
    
    // Constructor for full column response
    public ColumnDTO(Long id, String name, Integer orderIndex, String color, Integer taskLimit,
                    LocalDateTime createdAt, LocalDateTime updatedAt, List<TaskDTO> tasks) {
        this.id = id;
        this.name = name;
        this.orderIndex = orderIndex;
        this.color = color;
        this.taskLimit = taskLimit;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.tasks = tasks;
    }
}
