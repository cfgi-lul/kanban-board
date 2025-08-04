package Backend.Board.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import Backend.Board.dto.CommentDTO;
import Backend.Board.exception.ResourceNotFoundException;
import Backend.Board.mappers.CommentMapper;
import Backend.Board.model.Comment;
import Backend.Board.model.Task;
import Backend.Board.model.User;
import Backend.Board.repository.CommentRepository;
import Backend.Board.repository.TaskRepository;
import Backend.Board.repository.UserRepository;

@RestController
@RequestMapping("/comments")
public class CommentController {
    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Autowired
    public CommentController(CommentRepository commentRepository,
                             TaskRepository taskRepository,
                             UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
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
        Task task = taskRepository.findById(commentDTO.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        User author = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment comment = new Comment();
        comment.setContent(commentDTO.getContent());
        comment.setTask(task);
        comment.setUser(author);

        Comment savedComment = commentRepository.save(comment);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommentMapper.toDTO(savedComment));
    }

    @DeleteMapping
    public void deleteComment(@RequestParam Long id) {
        commentRepository.deleteById(id);
    }
}
