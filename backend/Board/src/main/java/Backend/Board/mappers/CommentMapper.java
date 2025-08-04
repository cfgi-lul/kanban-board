package Backend.Board.mappers;

import Backend.Board.dto.CommentDTO;
import Backend.Board.model.Comment;

public class CommentMapper {
    public static CommentDTO toDTO(Comment comment) {
        if (comment == null) return null;

        return new CommentDTO(
                comment.getId(),
                comment.getContent(),
                comment.getCreatedAt(),
                UserMapper.toDTO(comment.getUser()),
                comment.getTask().getId() // Add task ID
        );
    }

    public static Comment toEntity(CommentDTO commentDTO) {
        if (commentDTO == null)
            return null;

        Comment comment = new Comment();
        comment.setId(commentDTO.getId());
        comment.setContent(commentDTO.getContent());
        // User and task should be set in service layer
        return comment;
    }
}
