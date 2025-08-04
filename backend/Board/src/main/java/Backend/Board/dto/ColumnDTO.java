package Backend.Board.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ColumnDTO {
    private Long id;
    private String name;
    private List<TaskPreviewDTO> tasks;
}