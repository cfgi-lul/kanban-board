package Backend.Board.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import Backend.Board.dto.BoardDTO;
import Backend.Board.dto.CommentDTO;
import Backend.Board.dto.TaskDTO;
import Backend.Board.exception.ResourceNotFoundException;
import Backend.Board.mappers.BoardMapper;
import Backend.Board.mappers.UserMapper;
import Backend.Board.model.Board;
import Backend.Board.model.Column;
import Backend.Board.model.Task;
import Backend.Board.model.User;
import Backend.Board.repository.BoardRepository;
import Backend.Board.repository.ColumnRepository;
import Backend.Board.repository.TaskRepository;
import Backend.Board.repository.UserRepository;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired ColumnRepository columnRepository;

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
        return taskRepository.findById(id)
                .map(task -> {
                    List<CommentDTO> commentDTOs = task.getComments().stream()
                            .map(comment -> new CommentDTO(
                                    comment.getId(),
                                    comment.getContent(),
                                    comment.getCreatedAt(),
                                    UserMapper.toDTO(comment.getUser()),
                                    comment.getTask().getId()))
                            .collect(Collectors.toList());

                    return ResponseEntity.ok(new TaskDTO(
                            task.getId(),
                            task.getTitle(),
                            task.getDescription(),
                            commentDTOs,
                            UserMapper.toDTO(task.getCreatedBy()),
                            UserMapper.toDTO(task.getAssignee()))
                            );
                })
                .orElse(ResponseEntity.notFound().build());
    }

     @PostMapping
    public ResponseEntity<Task> createTask(
            @RequestParam Long boardId,
            @RequestParam Long columnId,
            @RequestBody Task task,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Fetch the board and column
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));
        Column column = columnRepository.findById(columnId)
                .orElseThrow(() -> new ResourceNotFoundException("Column not found"));

        // Fetch the user who created the task
        User creator = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Set the task's column and createdBy user
        task.setColumn(column);
        task.setCreatedBy(creator);

        // Validate the task title
        if (task.getTitle() == null || task.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Save the task
        Task savedTask = taskRepository.save(task);

        // Send the updated board state via WebSocket
        sendBoardUpdate(boardId);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedTask);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        if (updatedTask.getTitle() == null || updatedTask.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        return taskRepository.findById(id)
                .map(task -> {
                    task.setTitle(updatedTask.getTitle());
                    task.setDescription(updatedTask.getDescription());
                    Task savedTask = taskRepository.save(task);
                    sendBoardUpdate(savedTask.getId());
                    return ResponseEntity.ok(savedTask);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteTask(@PathVariable Long id) {
        return taskRepository.findByIdWithColumnAndBoard(id)
                .map(task -> {
                    Long boardId = task.getColumn().getBoard().getId();
                    taskRepository.delete(task);
                    taskRepository.flush(); // Critical for immediate sync

                    sendBoardUpdateDirect(boardId);
                    return ResponseEntity.noContent().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    private void sendBoardUpdateDirect(Long boardId) {
        boardRepository.findById(boardId)
                .ifPresent(board -> {
                    BoardDTO dto = BoardMapper.toDTO(board);
                    messagingTemplate.convertAndSend(
                            "/topic/board/" + boardId,
                            dto);
                });
    }

    private void sendBoardUpdate(Long taskId) {
        taskRepository.findByIdWithColumnAndBoard(taskId)
                .ifPresent(task -> {
                    Long boardId = task.getColumn().getBoard().getId();
                    boardRepository.findById(boardId)
                            .ifPresent(board -> {
                                BoardDTO dto = BoardMapper.toDTO(board);
                                messagingTemplate.convertAndSend(
                                        "/topic/board/" + boardId,
                                        dto);
                            });
                });
    }
}
