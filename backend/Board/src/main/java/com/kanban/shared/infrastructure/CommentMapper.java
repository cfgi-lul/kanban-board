package com.kanban.shared.infrastructure;

import com.kanban.shared.interfaces.rest.CommentDTO;
import com.kanban.shared.domain.model.Comment;



public class CommentMapper {
    public static CommentDTO toDTO(Comment comment) {
        if (comment == null) return null;

        return new CommentDTO(
                comment.getId(),
                comment.getContent(),
                comment.getCreatedAt(),
                comment.getUpdatedAt(),
                comment.getEditedAt(),
                comment.getMentions(),
                comment.isEdited(),
                UserMapper.toDTO(comment.getUser()),
                comment.getTask().getId()
        );
    }

    public static CommentDTO toPreviewDTO(Comment comment) {
        if (comment == null) return null;

        return new CommentDTO(
                comment.getId(),
                comment.getContent(),
                comment.getCreatedAt()
        );
    }

    public static Comment toEntity(CommentDTO commentDTO) {
        if (commentDTO == null)
            return null;

        Comment comment = new Comment();
        comment.setId(commentDTO.getId());
        comment.setContent(commentDTO.getContent());
        comment.setCreatedAt(commentDTO.getCreatedAt());
        comment.setUpdatedAt(commentDTO.getUpdatedAt());
        comment.setEditedAt(commentDTO.getEditedAt());
        comment.setMentions(commentDTO.getMentions());
        comment.setEdited(commentDTO.isEdited());
        // User and task should be set in service layer
        return comment;
    }
}
