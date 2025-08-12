package com.kanban.shared.infrastructure;

import java.util.List;
import java.util.stream.Collectors;
import com.kanban.shared.interfaces.rest.CommentDTO;
import com.kanban.task.interfaces.rest.TaskDTO;
import com.kanban.shared.interfaces.rest.AttachmentDTO;
import com.kanban.shared.interfaces.rest.LabelDTO;
import com.kanban.shared.domain.model.Comment;
import com.kanban.task.domain.model.Task;
import com.kanban.task.domain.model.TaskPriority;
import com.kanban.task.domain.model.TaskStatus;
import com.kanban.shared.domain.model.Attachment;
import com.kanban.shared.domain.model.Label;




public class TaskMapper {
    public static TaskDTO toDTO(Task task) {
        if (task == null) {
            return null;
        }
        
        List<CommentDTO> commentDTOs = null;
        if (task.getComments() != null) {
            commentDTOs = task.getComments().stream()
                    .map(CommentMapper::toDTO)
                    .collect(Collectors.toList());
        }
        
        List<AttachmentDTO> attachmentDTOs = null;
        if (task.getAttachments() != null) {
            attachmentDTOs = task.getAttachments().stream()
                    .map(AttachmentMapper::toDTO)
                    .collect(Collectors.toList());
        }
        
        List<LabelDTO> labelDTOs = null;
        if (task.getLabels() != null) {
            labelDTOs = task.getLabels().stream()
                    .map(LabelMapper::toDTO)
                    .collect(Collectors.toList());
        }
        
        TaskDTO dto = new TaskDTO(
            task.getId(),
            task.getTitle(),
            task.getDescription(),
            task.getPriority() != null ? task.getPriority().name() : null,
            task.getStatus() != null ? task.getStatus().name() : null,
            task.getDueDate(),
            task.getCreatedAt(),
            task.getUpdatedAt(),
            task.getPosition(),
            commentDTOs,
            attachmentDTOs,
            labelDTOs,
            UserMapper.toDTO(task.getCreatedBy()),
            UserMapper.toDTO(task.getAssignee())
        );

        if (task.getColumn() != null) {
            dto.setColumnId(task.getColumn().getId());
            if (task.getColumn().getBoard() != null) {
                dto.setBoardId(task.getColumn().getBoard().getId());
            }
        }

        return dto;
    }

    public static TaskDTO toPreviewDTO(Task task) {
        if (task == null) {
            return null;
        }
        return new TaskDTO(task.getId(), task.getTitle(), task.getPosition());
    }

    public static Task toEntity(TaskDTO taskDTO) {
        if (taskDTO == null) {
            return null;
        }
        
        Task task = new Task();
        task.setId(taskDTO.getId());
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setDueDate(taskDTO.getDueDate());
        task.setCreatedAt(taskDTO.getCreatedAt());
        task.setUpdatedAt(taskDTO.getUpdatedAt());
        task.setPosition(taskDTO.getPosition() != null ? taskDTO.getPosition() : 0);
        
        // Map priority
        if (taskDTO.getPriority() != null) {
            try {
                task.setPriority(TaskPriority.valueOf(taskDTO.getPriority()));
            } catch (IllegalArgumentException e) {
                task.setPriority(TaskPriority.MEDIUM); // Default fallback
            }
        }
        
        // Map status
        if (taskDTO.getStatus() != null) {
            try {
                task.setStatus(TaskStatus.valueOf(taskDTO.getStatus()));
            } catch (IllegalArgumentException e) {
                task.setStatus(TaskStatus.TODO); // Default fallback
            }
        }
        
        task.setCreatedBy(UserMapper.toEntity(taskDTO.getCreatedBy()));
        task.setAssignee(UserMapper.toEntity(taskDTO.getAssignee()));
        
        if (taskDTO.getComments() != null) {
            List<Comment> comments = taskDTO.getComments().stream()
                    .map(CommentMapper::toEntity)
                    .collect(Collectors.toList());
            task.setComments(comments);
        }
        
        if (taskDTO.getAttachments() != null) {
            List<Attachment> attachments = taskDTO.getAttachments().stream()
                    .map(AttachmentMapper::toEntity)
                    .collect(Collectors.toList());
            task.setAttachments(attachments);
        }
        
        if (taskDTO.getLabels() != null) {
            List<Label> labels = taskDTO.getLabels().stream()
                    .map(LabelMapper::toEntity)
                    .collect(Collectors.toList());
            task.setLabels(labels);
        }
        
        return task;
    }
}
