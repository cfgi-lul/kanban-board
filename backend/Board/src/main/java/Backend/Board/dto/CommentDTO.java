package Backend.Board.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private UserDTO author;
    private Long taskId;


    public CommentDTO(Long id, String content) {
        this.id = id;
        this.content = content;
    }
}