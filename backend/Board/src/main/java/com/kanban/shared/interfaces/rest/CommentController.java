package com.kanban.shared.interfaces.rest;

import com.kanban.shared.domain.exception.ResourceNotFoundException;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.kanban.shared.infrastructure.CommentMapper;
import com.kanban.shared.domain.model.Comment;
import com.kanban.task.domain.model.Task;
import com.kanban.user.domain.model.User;
import com.kanban.shared.infrastructure.CommentRepository;
import com.kanban.task.domain.repository.TaskRepository;
import com.kanban.user.domain.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import com.kanban.shared.interfaces.websocket.CommentWebSocketMessage;





@RestController
@RequestMapping("/comments")
public class CommentController {
    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public CommentController(CommentRepository commentRepository,
                             TaskRepository taskRepository,
                             UserRepository userRepository,
                             SimpMessagingTemplate messagingTemplate) {
        this.commentRepository = commentRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByTask(@PathVariable Long taskId) {
        List<Comment> comments = commentRepository.findByTaskIdOrderByCreatedAtDesc(taskId);
        return ResponseEntity.ok(comments.stream()
                .map(CommentMapper::toDTO)
                .collect(Collectors.toList()));
    }

    @PostMapping
    public ResponseEntity<CommentDTO> createComment(
            @RequestBody CommentDTO commentDTO,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        // Validate the comment content
        if (commentDTO.getContent() == null || commentDTO.getContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Task task = taskRepository.findById(commentDTO.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        User author = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment comment = new Comment();
        comment.setContent(commentDTO.getContent());
        comment.setTask(task);
        comment.setUser(author);
        comment.setMentions(commentDTO.getMentions());

        Comment savedComment = commentRepository.save(comment);
        CommentDTO dto = CommentMapper.toDTO(savedComment);

        // Notify subscribers on this task channel
        messagingTemplate.convertAndSend(
                "/topic/task/" + dto.getTaskId() + "/comments",
                new CommentWebSocketMessage("CREATED", dto.getTaskId(), dto, dto.getId())
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable Long id,
            @RequestBody CommentDTO commentDTO,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        // Validate the comment content
        if (commentDTO.getContent() == null || commentDTO.getContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        return commentRepository.findById(id)
                .map(comment -> {
                    // Check if user is the author of the comment
                    if (!comment.getUser().getUsername().equals(userDetails.getUsername())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).<CommentDTO>build();
                    }

                    comment.setContent(commentDTO.getContent());
                    comment.setMentions(commentDTO.getMentions());
                    
                    Comment savedComment = commentRepository.save(comment);
                    CommentDTO dto = CommentMapper.toDTO(savedComment);

                    // Notify subscribers
                    messagingTemplate.convertAndSend(
                            "/topic/task/" + dto.getTaskId() + "/comments",
                            new CommentWebSocketMessage("UPDATED", dto.getTaskId(), dto, dto.getId())
                    );

                    return ResponseEntity.ok(dto);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return commentRepository.findById(id)
                .map(comment -> {
                    // Check if user is the author of the comment
                    if (!comment.getUser().getUsername().equals(userDetails.getUsername())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).<Void>build();
                    }

                    Long taskId = comment.getTask().getId();
                    Long commentId = comment.getId();
                    commentRepository.delete(comment);

                    // Notify subscribers about deletion
                    messagingTemplate.convertAndSend(
                            "/topic/task/" + taskId + "/comments",
                            new CommentWebSocketMessage("DELETED", taskId, null, commentId)
                    );

                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
