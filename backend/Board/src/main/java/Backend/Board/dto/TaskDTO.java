package Backend.Board.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    private Long id;
    
    @NotBlank(message = "Task title is required")
    @Size(min = 1, max = 200, message = "Task title must be between 1 and 200 characters")
    private String title;
    
    @Size(max = 1000, message = "Task description must not exceed 1000 characters")
    private String description;
    
    private List<CommentDTO> comments;
    private UserDTO createdBy;
    private UserDTO assignee;
}