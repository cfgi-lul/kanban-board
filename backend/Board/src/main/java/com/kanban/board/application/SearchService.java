package com.kanban.board.application;

import com.kanban.task.interfaces.rest.TaskDTO;
import com.kanban.board.interfaces.rest.BoardDTO;
import com.kanban.user.interfaces.rest.UserDTO;
import com.kanban.shared.infrastructure.TaskMapper;
import com.kanban.shared.infrastructure.BoardMapper;
import com.kanban.shared.infrastructure.UserMapper;
import com.kanban.task.domain.model.Task;
import com.kanban.board.domain.model.Board;
import com.kanban.user.domain.model.User;
import com.kanban.task.domain.model.TaskPriority;
import com.kanban.task.domain.model.TaskStatus;
import com.kanban.task.domain.repository.TaskRepository;
import com.kanban.board.domain.repository.BoardRepository;
import com.kanban.user.domain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Advanced task search with multiple criteria
     */
    public List<TaskDTO> searchTasks(String query, String priority, String status, 
                                   Long assigneeId, Long boardId, LocalDateTime dueDateFrom, 
                                   LocalDateTime dueDateTo, int page, int size) {
        
        // This would need custom repository methods for complex search
        // For now, returning filtered results from basic repository methods
        List<Task> tasks = taskRepository.findAll();
        
        return tasks.stream()
                .filter(task -> matchesSearchCriteria(task, query, priority, status, assigneeId, boardId, dueDateFrom, dueDateTo))
                .map(TaskMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search boards by name, description, or creator
     */
    public List<BoardDTO> searchBoards(String query, Long creatorId, Boolean archived, int page, int size) {
        List<Board> boards = boardRepository.findAll();
        
        return boards.stream()
                .filter(board -> matchesBoardSearchCriteria(board, query, creatorId, archived))
                .map(BoardMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search users by username, display name, or email
     */
    public List<UserDTO> searchUsers(String query, Boolean enabled, int page, int size) {
        List<User> users = userRepository.findAll();
        
        return users.stream()
                .filter(user -> matchesUserSearchCriteria(user, query, enabled))
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get tasks by priority
     */
    public List<TaskDTO> getTasksByPriority(TaskPriority priority, int page, int size) {
        List<Task> tasks = taskRepository.findAll();
        
        return tasks.stream()
                .filter(task -> task.getPriority() == priority)
                .map(TaskMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get tasks by status
     */
    public List<TaskDTO> getTasksByStatus(TaskStatus status, int page, int size) {
        List<Task> tasks = taskRepository.findAll();
        
        return tasks.stream()
                .filter(task -> task.getStatus() == status)
                .map(TaskMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get overdue tasks
     */
    public List<TaskDTO> getOverdueTasks(int page, int size) {
        LocalDateTime now = LocalDateTime.now();
        List<Task> tasks = taskRepository.findAll();
        
        return tasks.stream()
                .filter(task -> task.getDueDate() != null && task.getDueDate().isBefore(now))
                .map(TaskMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get tasks due soon (within next 7 days)
     */
    public List<TaskDTO> getTasksDueSoon(int page, int size) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime weekFromNow = now.plusDays(7);
        List<Task> tasks = taskRepository.findAll();
        
        return tasks.stream()
                .filter(task -> task.getDueDate() != null && 
                               task.getDueDate().isAfter(now) && 
                               task.getDueDate().isBefore(weekFromNow))
                .map(TaskMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get user's assigned tasks
     */
    public List<TaskDTO> getUserAssignedTasks(Long userId, int page, int size) {
        List<Task> tasks = taskRepository.findAll();
        
        return tasks.stream()
                .filter(task -> task.getAssignee() != null && task.getAssignee().getId().equals(userId))
                .map(TaskMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get user's created tasks
     */
    public List<TaskDTO> getUserCreatedTasks(Long userId, int page, int size) {
        List<Task> tasks = taskRepository.findAll();
        
        return tasks.stream()
                .filter(task -> task.getCreatedBy() != null && task.getCreatedBy().getId().equals(userId))
                .map(TaskMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Helper methods for filtering
    private boolean matchesSearchCriteria(Task task, String query, String priority, String status, 
                                       Long assigneeId, Long boardId, LocalDateTime dueDateFrom, 
                                       LocalDateTime dueDateTo) {
        
        // Query matching
        if (query != null && !query.trim().isEmpty()) {
            String searchQuery = query.toLowerCase();
            boolean matchesQuery = (task.getTitle() != null && task.getTitle().toLowerCase().contains(searchQuery)) ||
                                 (task.getDescription() != null && task.getDescription().toLowerCase().contains(searchQuery));
            if (!matchesQuery) return false;
        }
        
        // Priority matching
        if (priority != null && !priority.trim().isEmpty()) {
            try {
                TaskPriority searchPriority = TaskPriority.valueOf(priority.toUpperCase());
                if (task.getPriority() != searchPriority) return false;
            } catch (IllegalArgumentException e) {
                return false;
            }
        }
        
        // Status matching
        if (status != null && !status.trim().isEmpty()) {
            try {
                TaskStatus searchStatus = TaskStatus.valueOf(status.toUpperCase());
                if (task.getStatus() != searchStatus) return false;
            } catch (IllegalArgumentException e) {
                return false;
            }
        }
        
        // Assignee matching
        if (assigneeId != null) {
            if (task.getAssignee() == null || !task.getAssignee().getId().equals(assigneeId)) {
                return false;
            }
        }
        
        // Board matching
        if (boardId != null) {
            if (task.getColumn() == null || task.getColumn().getBoard() == null || 
                !task.getColumn().getBoard().getId().equals(boardId)) {
                return false;
            }
        }
        
        // Due date range matching
        if (dueDateFrom != null && task.getDueDate() != null && task.getDueDate().isBefore(dueDateFrom)) {
            return false;
        }
        
        if (dueDateTo != null && task.getDueDate() != null && task.getDueDate().isAfter(dueDateTo)) {
            return false;
        }
        
        return true;
    }

    private boolean matchesBoardSearchCriteria(Board board, String query, Long creatorId, Boolean archived) {
        // Query matching
        if (query != null && !query.trim().isEmpty()) {
            String searchQuery = query.toLowerCase();
            boolean matchesQuery = (board.getName() != null && board.getName().toLowerCase().contains(searchQuery)) ||
                                 (board.getDescription() != null && board.getDescription().toLowerCase().contains(searchQuery));
            if (!matchesQuery) return false;
        }
        
        // Creator matching
        if (creatorId != null) {
            if (board.getCreatedBy() == null || !board.getCreatedBy().getId().equals(creatorId)) {
                return false;
            }
        }
        
        // Archived matching
        if (archived != null && board.isArchived() != archived) {
            return false;
        }
        
        return true;
    }

    private boolean matchesUserSearchCriteria(User user, String query, Boolean enabled) {
        // Query matching
        if (query != null && !query.trim().isEmpty()) {
            String searchQuery = query.toLowerCase();
            boolean matchesQuery = (user.getUsername() != null && user.getUsername().toLowerCase().contains(searchQuery)) ||
                                 (user.getDisplayName() != null && user.getDisplayName().toLowerCase().contains(searchQuery)) ||
                                 (user.getEmail() != null && user.getEmail().toLowerCase().contains(searchQuery));
            if (!matchesQuery) return false;
        }
        
        // Enabled matching
        if (enabled != null && user.isEnabled() != enabled) {
            return false;
        }
        
        return true;
    }
} 
