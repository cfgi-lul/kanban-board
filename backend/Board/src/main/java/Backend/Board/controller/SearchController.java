package Backend.Board.controller;

import Backend.Board.dto.TaskDTO;
import Backend.Board.dto.BoardDTO;
import Backend.Board.dto.UserDTO;
import Backend.Board.model.TaskPriority;
import Backend.Board.model.TaskStatus;
import Backend.Board.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/search")
public class SearchController {

    @Autowired
    private SearchService searchService;

    /**
     * Advanced task search with multiple criteria
     */
    @GetMapping("/tasks")
    public ResponseEntity<List<TaskDTO>> searchTasks(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long assigneeId,
            @RequestParam(required = false) Long boardId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dueDateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dueDateTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<TaskDTO> results = searchService.searchTasks(query, priority, status, assigneeId, boardId, dueDateFrom, dueDateTo, page, size);
        return ResponseEntity.ok(results);
    }

    /**
     * Search boards by name, description, or creator
     */
    @GetMapping("/boards")
    public ResponseEntity<List<BoardDTO>> searchBoards(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long creatorId,
            @RequestParam(required = false) Boolean archived,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<BoardDTO> results = searchService.searchBoards(query, creatorId, archived, page, size);
        return ResponseEntity.ok(results);
    }

    /**
     * Search users by username, display name, or email
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> searchUsers(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Boolean enabled,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<UserDTO> results = searchService.searchUsers(query, enabled, page, size);
        return ResponseEntity.ok(results);
    }

    /**
     * Get tasks by priority
     */
    @GetMapping("/tasks/priority/{priority}")
    public ResponseEntity<List<TaskDTO>> getTasksByPriority(
            @PathVariable TaskPriority priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<TaskDTO> results = searchService.getTasksByPriority(priority, page, size);
        return ResponseEntity.ok(results);
    }

    /**
     * Get tasks by status
     */
    @GetMapping("/tasks/status/{status}")
    public ResponseEntity<List<TaskDTO>> getTasksByStatus(
            @PathVariable TaskStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<TaskDTO> results = searchService.getTasksByStatus(status, page, size);
        return ResponseEntity.ok(results);
    }

    /**
     * Get overdue tasks
     */
    @GetMapping("/tasks/overdue")
    public ResponseEntity<List<TaskDTO>> getOverdueTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<TaskDTO> results = searchService.getOverdueTasks(page, size);
        return ResponseEntity.ok(results);
    }

    /**
     * Get tasks due soon (within next 7 days)
     */
    @GetMapping("/tasks/due-soon")
    public ResponseEntity<List<TaskDTO>> getTasksDueSoon(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<TaskDTO> results = searchService.getTasksDueSoon(page, size);
        return ResponseEntity.ok(results);
    }

    /**
     * Get user's assigned tasks
     */
    @GetMapping("/tasks/assigned/{userId}")
    public ResponseEntity<List<TaskDTO>> getUserAssignedTasks(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<TaskDTO> results = searchService.getUserAssignedTasks(userId, page, size);
        return ResponseEntity.ok(results);
    }

    /**
     * Get user's created tasks
     */
    @GetMapping("/tasks/created/{userId}")
    public ResponseEntity<List<TaskDTO>> getUserCreatedTasks(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        List<TaskDTO> results = searchService.getUserCreatedTasks(userId, page, size);
        return ResponseEntity.ok(results);
    }

    /**
     * Get current user's assigned tasks
     */
    @GetMapping("/tasks/my-assigned")
    public ResponseEntity<List<TaskDTO>> getMyAssignedTasks(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        // This would need to get the user ID from userDetails
        // For now, returning empty list as placeholder
        return ResponseEntity.ok(List.of());
    }

    /**
     * Get current user's created tasks
     */
    @GetMapping("/tasks/my-created")
    public ResponseEntity<List<TaskDTO>> getMyCreatedTasks(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        // This would need to get the user ID from userDetails
        // For now, returning empty list as placeholder
        return ResponseEntity.ok(List.of());
    }
} 