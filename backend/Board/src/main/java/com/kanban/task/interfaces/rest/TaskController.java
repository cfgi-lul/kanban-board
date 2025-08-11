package com.kanban.task.interfaces.rest;

import com.kanban.shared.domain.exception.ResourceNotFoundException;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.kanban.board.interfaces.rest.BoardDTO;
import com.kanban.shared.infrastructure.BoardMapper;
import com.kanban.shared.infrastructure.TaskMapper;
import com.kanban.board.domain.model.BoardColumn;
import com.kanban.task.domain.model.Task;
import com.kanban.task.domain.model.TaskPriority;
import com.kanban.task.domain.model.TaskStatus;
import com.kanban.user.domain.model.User;
import com.kanban.shared.domain.model.Label;
import com.kanban.board.domain.repository.BoardRepository;
import com.kanban.board.domain.repository.ColumnRepository;
import com.kanban.task.domain.repository.TaskRepository;
import com.kanban.task.application.TaskPositionService;
import com.kanban.user.domain.repository.UserRepository;
import com.kanban.shared.infrastructure.LabelRepository;





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

    @Autowired
    private ColumnRepository columnRepository;

    @Autowired
    private LabelRepository labelRepository;

    @Autowired
    private TaskPositionService taskPositionService;

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
        return taskRepository.findById(id)
                .map(TaskMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(
            @RequestParam Long boardId,
            @RequestParam Long columnId,
            @RequestBody TaskDTO taskDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Fetch the board and column
        boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found"));
        BoardColumn column = columnRepository.findById(columnId)
                .orElseThrow(() -> new ResourceNotFoundException("Column not found"));

        // Fetch the user who created the task
        User creator = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Convert DTO to entity
        Task task = TaskMapper.toEntity(taskDTO);
        task.setCreatedBy(creator);

        // Validate the task title
        if (task.getTitle() == null || task.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Add task to the end of the column with proper positioning
        Task savedTask = taskPositionService.addTaskToEndOfColumn(task, column);
        taskRepository.flush(); // Ensure task is persisted

        // Send the updated board state via WebSocket
        sendBoardUpdateDirect(boardId);

        return ResponseEntity.status(HttpStatus.CREATED).body(TaskMapper.toDTO(savedTask));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id, @RequestBody TaskDTO updatedTaskDTO) {
        if (updatedTaskDTO.getTitle() == null || updatedTaskDTO.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        return taskRepository.findById(id)
                .map(task -> {
                    // Update task fields from DTO
                    task.setTitle(updatedTaskDTO.getTitle());
                    task.setDescription(updatedTaskDTO.getDescription());
                    task.setDueDate(updatedTaskDTO.getDueDate());
                    
                    // Update priority and status if provided
                    if (updatedTaskDTO.getPriority() != null) {
                        try {
                            task.setPriority(TaskPriority.valueOf(updatedTaskDTO.getPriority()));
                        } catch (IllegalArgumentException e) {
                            // Keep existing priority if invalid value
                        }
                    }
                    
                    if (updatedTaskDTO.getStatus() != null) {
                        try {
                            task.setStatus(TaskStatus.valueOf(updatedTaskDTO.getStatus()));
                        } catch (IllegalArgumentException e) {
                            // Keep existing status if invalid value
                        }
                    }
                    
                    // Handle position update if provided
                    if (updatedTaskDTO.getPosition() != null && !updatedTaskDTO.getPosition().equals(task.getPosition())) {
                        taskPositionService.moveTaskToPosition(task, updatedTaskDTO.getPosition());
                    }
                    
                    Task savedTask = taskRepository.save(task);
                    taskRepository.flush(); // Ensure task is persisted
                    sendBoardUpdateDirect(savedTask.getColumn().getBoard().getId());
                    return ResponseEntity.ok(TaskMapper.toDTO(savedTask));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteTask(@PathVariable Long id) {
        try {
            return taskRepository.findByIdWithColumnAndBoard(id)
                    .map(task -> {
                        Long boardId = task.getColumn().getBoard().getId();
                        Long columnId = task.getColumn().getId();
                        Integer position = task.getPosition();
                        
                        // First, reorder remaining tasks in the column
                        if (position != null) {
                            List<Task> tasksToShift = taskRepository.findByColumnIdAndPositionGreaterThanEqualOrderByPositionAsc(
                                    columnId, position + 1);
                            
                            for (Task taskToShift : tasksToShift) {
                                taskToShift.setPosition(taskToShift.getPosition() - 1);
                                taskRepository.save(taskToShift);
                            }
                        }
                        
                        // Then delete the task
                        taskRepository.delete(task);
                        taskRepository.flush(); // Critical for immediate sync

                        sendBoardUpdateDirect(boardId);
                        return ResponseEntity.noContent().build();
                    })
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            // Log the error for debugging
            System.err.println("Error deleting task with ID " + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while deleting the task");
        }
    }

    // Label management for tasks
    @PostMapping("/{taskId}/labels/{labelId}")
    public ResponseEntity<TaskDTO> addLabelToTask(@PathVariable Long taskId, @PathVariable Long labelId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new ResourceNotFoundException("Label not found"));

        // Check if label belongs to the same board as the task
        if (!label.getBoard().getId().equals(task.getColumn().getBoard().getId())) {
            return ResponseEntity.badRequest().build();
        }

        if (!task.getLabels().contains(label)) {
            task.getLabels().add(label);
            Task savedTask = taskRepository.save(task);
            return ResponseEntity.ok(TaskMapper.toDTO(savedTask));
        }

        return ResponseEntity.ok(TaskMapper.toDTO(task));
    }

    @DeleteMapping("/{taskId}/labels/{labelId}")
    public ResponseEntity<TaskDTO> removeLabelFromTask(@PathVariable Long taskId, @PathVariable Long labelId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new ResourceNotFoundException("Label not found"));

        task.getLabels().remove(label);
        Task savedTask = taskRepository.save(task);
        return ResponseEntity.ok(TaskMapper.toDTO(savedTask));
    }

    // Bulk operations
    @PostMapping("/bulk/update-status")
    public ResponseEntity<List<TaskDTO>> bulkUpdateStatus(@RequestBody List<Long> taskIds,
                                                         @RequestParam String status) {
        try {
            TaskStatus newStatus = TaskStatus.valueOf(status);
            List<Task> tasks = taskRepository.findAllById(taskIds);
            
            tasks.forEach(task -> task.setStatus(newStatus));
            List<Task> savedTasks = taskRepository.saveAll(tasks);
            
            List<TaskDTO> taskDTOs = savedTasks.stream()
                    .map(TaskMapper::toDTO)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(taskDTOs);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/bulk/assign")
    public ResponseEntity<List<TaskDTO>> bulkAssignTasks(@RequestBody List<Long> taskIds,
                                                        @RequestParam Long assigneeId) {
        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
        
        List<Task> tasks = taskRepository.findAllById(taskIds);
        tasks.forEach(task -> task.setAssignee(assignee));
        
        List<Task> savedTasks = taskRepository.saveAll(tasks);
        List<TaskDTO> taskDTOs = savedTasks.stream()
                .map(TaskMapper::toDTO)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(taskDTOs);
    }

    // Search and filter endpoints
    @GetMapping("/search")
    public ResponseEntity<List<TaskDTO>> searchTasks(@RequestParam String query,
                                                    @RequestParam(required = false) String priority,
                                                    @RequestParam(required = false) String status) {
        // This would need a custom repository method for full-text search
        // For now, returning empty list as placeholder
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/filter")
    public ResponseEntity<List<TaskDTO>> filterTasks(@RequestParam(required = false) String priority,
                                                    @RequestParam(required = false) String status,
                                                    @RequestParam(required = false) Long assigneeId) {
        // This would need custom repository methods for filtering
        // For now, returning empty list as placeholder
        return ResponseEntity.ok(List.of());
    }

    private void sendBoardUpdateDirect(Long boardId) {
        boardRepository.findWithColumnsAndTasksById(boardId)
                .ifPresent(board -> {
                    // Manually load tasks for each column to avoid multiple bag fetch issue
                    board.getColumns().forEach(col -> {
                        col.getTasks().size(); // Force lazy loading of tasks
                    });
                    
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
                    boardRepository.findWithColumnsAndTasksById(boardId)
                            .ifPresent(board -> {
                                // Manually load tasks for each column to avoid multiple bag fetch issue
                                board.getColumns().forEach(col -> {
                                    col.getTasks().size(); // Force lazy loading of tasks
                                });
                                
                                BoardDTO dto = BoardMapper.toDTO(board);
                                messagingTemplate.convertAndSend(
                                        "/topic/board/" + boardId,
                                        dto);
                            });
                });
    }

    // Position management endpoints
    @PutMapping("/{taskId}/position")
    public ResponseEntity<TaskDTO> moveTaskToPosition(@PathVariable Long taskId, 
                                                     @RequestParam Integer position) {
        try {
            Task task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
            
            taskPositionService.moveTaskToPosition(task, position);
            Task savedTask = taskRepository.save(task);
            
            Long boardId = savedTask.getColumn().getBoard().getId();
            sendBoardUpdateDirect(boardId);
            return ResponseEntity.ok(TaskMapper.toDTO(savedTask));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{taskId}/move")
    public ResponseEntity<TaskDTO> moveTaskToColumn(@PathVariable Long taskId,
                                                   @RequestParam Long columnId,
                                                   @RequestParam Integer position) {
        try {
            Task task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
            
            BoardColumn newColumn = columnRepository.findById(columnId)
                    .orElseThrow(() -> new ResourceNotFoundException("Column not found"));
            
            taskPositionService.moveTaskToColumn(task, newColumn, position);
            Task savedTask = taskRepository.save(task);
            
            Long boardId = savedTask.getColumn().getBoard().getId();
            sendBoardUpdateDirect(boardId);
            return ResponseEntity.ok(TaskMapper.toDTO(savedTask));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/column/{columnId}/ordered")
    public ResponseEntity<List<TaskDTO>> getTasksInColumnOrdered(@PathVariable Long columnId) {
        try {
            List<Task> tasks = taskRepository.findByColumnIdOrderByPositionAsc(columnId);
            List<TaskDTO> taskDTOs = tasks.stream()
                    .map(TaskMapper::toDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(taskDTOs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/column/{columnId}/reorder")
    public ResponseEntity<Void> reorderColumnTasks(@PathVariable Long columnId) {
        try {
            List<Task> tasks = taskRepository.findByColumnIdOrderByPositionAsc(columnId);
            
            for (int i = 0; i < tasks.size(); i++) {
                Task task = tasks.get(i);
                if (!task.getPosition().equals(i)) {
                    task.setPosition(i);
                    taskRepository.save(task);
                }
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
