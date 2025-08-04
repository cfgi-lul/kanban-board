package Backend.Board.mappers;

import java.util.List;
import java.util.stream.Collectors;

import Backend.Board.dto.ColumnDTO;
import Backend.Board.dto.TaskPreviewDTO;
import Backend.Board.model.Column;
import Backend.Board.model.Task;

public class ColumnMapper {
    public static ColumnDTO toDTO(Column column) {
        if (column == null) {
            return null;
        }
        ColumnDTO columnDTO = new ColumnDTO();
        columnDTO.setId(column.getId());
        columnDTO.setName(column.getName());
        if (column.getTasks() != null) {
            List<TaskPreviewDTO> taskPreviewDTOs = column.getTasks().stream()
                    .map(TaskMapper::toPreviewDTO)
                    .collect(Collectors.toList());
            columnDTO.setTasks(taskPreviewDTOs);
        }
        return columnDTO;
    }

    public static Column toEntity(ColumnDTO columnDTO) {
        if (columnDTO == null) {
            return null;
        }
        Column column = new Column();
        column.setId(columnDTO.getId());
        column.setName(columnDTO.getName());
        if (columnDTO.getTasks() != null) {
            List<Task> tasks = columnDTO.getTasks().stream()
                    .map(TaskMapper::toEntityFromPreview)
                    .collect(Collectors.toList());
            column.setTasks(tasks);
        }
        return column;
    }

}
