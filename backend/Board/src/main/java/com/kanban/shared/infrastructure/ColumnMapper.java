package com.kanban.shared.infrastructure;

import java.util.List;
import java.util.stream.Collectors;
import com.kanban.board.interfaces.rest.ColumnDTO;
import com.kanban.task.interfaces.rest.TaskDTO;
import com.kanban.board.domain.model.BoardColumn;
import com.kanban.task.domain.model.Task;




public class ColumnMapper {
    public static ColumnDTO toDTO(BoardColumn column) {
        if (column == null) {
            return null;
        }
        
        List<TaskDTO> taskDTOs = null;
        if (column.getTasks() != null) {
            taskDTOs = column.getTasks().stream()
                    .map(TaskMapper::toPreviewDTO)
                    .collect(Collectors.toList());
        }
        
        return new ColumnDTO(
            column.getId(),
            column.getName(),
            column.getOrderIndex(),
            column.getColor(),
            column.getTaskLimit(),
            column.getCreatedAt(),
            column.getUpdatedAt(),
            taskDTOs
        );
    }

    public static ColumnDTO toPreviewDTO(BoardColumn column) {
        if (column == null) {
            return null;
        }
        return new ColumnDTO(column.getId(), column.getName(), column.getOrderIndex());
    }

    public static BoardColumn toEntity(ColumnDTO columnDTO) {
        if (columnDTO == null) {
            return null;
        }
        
        BoardColumn column = new BoardColumn();
        column.setId(columnDTO.getId());
        column.setName(columnDTO.getName());
        column.setOrderIndex(columnDTO.getOrderIndex());
        column.setColor(columnDTO.getColor());
        column.setTaskLimit(columnDTO.getTaskLimit());
        column.setCreatedAt(columnDTO.getCreatedAt());
        column.setUpdatedAt(columnDTO.getUpdatedAt());
        
        if (columnDTO.getTasks() != null) {
            List<Task> tasks = columnDTO.getTasks().stream()
                    .map(TaskMapper::toEntity)
                    .collect(Collectors.toList());
            column.setTasks(tasks);
        }
        
        return column;
    }
}
