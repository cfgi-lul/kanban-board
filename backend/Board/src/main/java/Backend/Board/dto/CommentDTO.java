package Backend.Board.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CommentDTO {
    private Long id;
    
    @NotBlank(message = "Comment content is required")
    @Size(min = 1, max = 1000, message = "Comment content must be between 1 and 1000 characters")
    private String content;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private LocalDateTime editedAt;
    
    private String mentions; // JSON string for user mentions
    
    private boolean edited = false;
    
    private UserDTO author;
    
    private Long taskId;
    
    // Constructor for comment creation
    public CommentDTO(String content, Long taskId) {
        this.content = content;
        this.taskId = taskId;
    }
    
    // Constructor for comment preview (minimal data)
    public CommentDTO(Long id, String content, LocalDateTime createdAt) {
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
    }
    
    // Constructor for full comment response
    public CommentDTO(Long id, String content, LocalDateTime createdAt, LocalDateTime updatedAt,
                     LocalDateTime editedAt, String mentions, boolean edited, UserDTO author, Long taskId) {
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.editedAt = editedAt;
        this.mentions = mentions;
        this.edited = edited;
        this.author = author;
        this.taskId = taskId;
    }
}