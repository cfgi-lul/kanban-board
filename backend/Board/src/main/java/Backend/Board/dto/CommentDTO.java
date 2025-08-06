package Backend.Board.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Long id;
    
    @NotBlank(message = "Comment content is required")
    @Size(min = 1, max = 500, message = "Comment content must be between 1 and 500 characters")
    private String content;
    
    private LocalDateTime createdAt;
    private UserDTO author;
    private Long taskId;

    public CommentDTO(Long id, String content) {
        this.id = id;
        this.content = content;
    }
}