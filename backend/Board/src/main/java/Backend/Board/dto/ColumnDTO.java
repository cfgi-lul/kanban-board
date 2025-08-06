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
public class ColumnDTO {
    private Long id;
    
    @NotBlank(message = "Column name is required")
    @Size(min = 1, max = 50, message = "Column name must be between 1 and 50 characters")
    private String name;
    
    private List<TaskPreviewDTO> tasks;
}