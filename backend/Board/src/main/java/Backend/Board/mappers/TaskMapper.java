package Backend.Board.mappers;

import java.util.List;
import java.util.stream.Collectors;

import Backend.Board.dto.CommentDTO;
import Backend.Board.dto.TaskDTO;
import Backend.Board.dto.TaskPreviewDTO;
import Backend.Board.model.Comment;
import Backend.Board.model.Task;

public class TaskMapper {
    public static TaskDTO toDTO(Task task) {
        if (task == null) {
            return null;
        }
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setId(task.getId());
        taskDTO.setTitle(task.getTitle());
        taskDTO.setCreatedBy(UserMapper.toDTO(task.getCreatedBy()));
        taskDTO.setAssignee(UserMapper.toDTO(task.getAssignee()));
        taskDTO.setDescription(task.getDescription());
        if (task.getComments() != null) {
            List<CommentDTO> commentDTOs = task.getComments().stream()
                    .map(CommentMapper::toDTO)
                    .collect(Collectors.toList());
            taskDTO.setComments(commentDTOs);
        }
        return taskDTO;
    }

    public static TaskPreviewDTO toPreviewDTO(Task task) {
        if (task == null) {
            return null;
        }
        TaskPreviewDTO taskPreviewDTO = new TaskPreviewDTO();
        taskPreviewDTO.setId(task.getId());
        taskPreviewDTO.setTitle(task.getTitle());
        return taskPreviewDTO;
    }

    public static Task toEntity(TaskDTO taskDTO) {
        if (taskDTO == null) {
            return null;
        }
        Task task = new Task();
        task.setId(taskDTO.getId());
        task.setTitle(taskDTO.getTitle());
        task.setCreatedBy(UserMapper.toEntity(taskDTO.getCreatedBy()));
        task.setAssignee(UserMapper.toEntity(taskDTO.getAssignee()));
        task.setDescription(taskDTO.getDescription());
        if (taskDTO.getComments() != null) {
            List<Comment> comments = taskDTO.getComments().stream()
                    .map(CommentMapper::toEntity)
                    .collect(Collectors.toList());
            task.setComments(comments);
        }
        return task;
    }

    public static Task toEntityFromPreview(TaskPreviewDTO taskPreviewDTO) {
        if (taskPreviewDTO == null) {
            return null;
        }
        Task task = new Task();
        task.setId(taskPreviewDTO.getId());
        task.setTitle(taskPreviewDTO.getTitle());
        return task;
    }
}
