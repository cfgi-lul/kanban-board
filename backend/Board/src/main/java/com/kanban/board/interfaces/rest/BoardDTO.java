package com.kanban.board.interfaces.rest;

import com.kanban.user.interfaces.rest.UserDTO;
import com.kanban.shared.interfaces.rest.LabelDTO;
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
public class BoardDTO {
    private Long id;
    
    @NotBlank(message = "Board name is required")
    @Size(min = 1, max = 100, message = "Board name must be between 1 and 100 characters")
    private String name;
    
    @Size(max = 500, message = "Board description must not exceed 500 characters")
    private String description;
    
    private String settings; // JSON string for board configuration
    
    private String invitationCode;
    
    private boolean archived = false;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private UserDTO createdBy;
    
    private List<ColumnDTO> columns;
    
    private List<LabelDTO> labels;
    
    // Constructor for board creation
    public BoardDTO(String name, String description) {
        this.name = name;
        this.description = description;
    }
    
    // Constructor for board preview (minimal data)
    public BoardDTO(Long id, String name, boolean archived) {
        this.id = id;
        this.name = name;
        this.archived = archived;
    }
    
    // Constructor for full board response
    public BoardDTO(Long id, String name, String description, String settings, 
                   String invitationCode, boolean archived, LocalDateTime createdAt, 
                   LocalDateTime updatedAt, UserDTO createdBy, List<ColumnDTO> columns, List<LabelDTO> labels) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.settings = settings;
        this.invitationCode = invitationCode;
        this.archived = archived;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.createdBy = createdBy;
        this.columns = columns;
        this.labels = labels;
    }
}
