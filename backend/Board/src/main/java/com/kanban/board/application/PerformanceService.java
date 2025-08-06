package com.kanban.board.application;

import com.kanban.board.interfaces.rest.BoardDTO;
import com.kanban.task.interfaces.rest.TaskDTO;
import com.kanban.user.interfaces.rest.UserDTO;
import com.kanban.shared.infrastructure.BoardMapper;
import com.kanban.shared.infrastructure.TaskMapper;
import com.kanban.shared.infrastructure.UserMapper;
import com.kanban.board.domain.model.Board;
import com.kanban.task.domain.model.Task;
import com.kanban.board.domain.repository.BoardRepository;
import com.kanban.task.domain.repository.TaskRepository;
import com.kanban.user.domain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;




@Service
public class PerformanceService {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    private final Executor executor = Executors.newFixedThreadPool(4);

    /**
     * Cache board data for better performance
     */
    @Cacheable(value = "boards", key = "#boardId")
    public BoardDTO getCachedBoard(Long boardId) {
        return boardRepository.findById(boardId)
                .map(BoardMapper::toDTO)
                .orElse(null);
    }

    /**
     * Cache user data for better performance
     */
    @Cacheable(value = "users", key = "#userId")
    public UserDTO getCachedUser(Long userId) {
        return userRepository.findById(userId)
                .map(UserMapper::toDTO)
                .orElse(null);
    }

    /**
     * Cache task data for better performance
     */
    @Cacheable(value = "tasks", key = "#taskId")
    public TaskDTO getCachedTask(Long taskId) {
        return taskRepository.findById(taskId)
                .map(TaskMapper::toDTO)
                .orElse(null);
    }

    /**
     * Evict board cache when board is updated
     */
    @CacheEvict(value = "boards", key = "#boardId")
    public void evictBoardCache(Long boardId) {
        // Cache eviction is handled by annotation
    }

    /**
     * Evict user cache when user is updated
     */
    @CacheEvict(value = "users", key = "#userId")
    public void evictUserCache(Long userId) {
        // Cache eviction is handled by annotation
    }

    /**
     * Evict task cache when task is updated
     */
    @CacheEvict(value = "tasks", key = "#taskId")
    public void evictTaskCache(Long taskId) {
        // Cache eviction is handled by annotation
    }

    /**
     * Asynchronous board loading for better performance
     */
    public CompletableFuture<BoardDTO> getBoardAsync(Long boardId) {
        return CompletableFuture.supplyAsync(() -> {
            return boardRepository.findById(boardId)
                    .map(BoardMapper::toDTO)
                    .orElse(null);
        }, executor);
    }

    /**
     * Asynchronous task loading for better performance
     */
    public CompletableFuture<List<TaskDTO>> getTasksAsync(List<Long> taskIds) {
        return CompletableFuture.supplyAsync(() -> {
            return taskRepository.findAllById(taskIds).stream()
                    .map(TaskMapper::toDTO)
                    .collect(Collectors.toList());
        }, executor);
    }

    /**
     * Batch load boards for better performance
     */
    public List<BoardDTO> getBoardsBatch(List<Long> boardIds) {
        return boardRepository.findAllById(boardIds).stream()
                .map(BoardMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Batch load tasks for better performance
     */
    public List<TaskDTO> getTasksBatch(List<Long> taskIds) {
        return taskRepository.findAllById(taskIds).stream()
                .map(TaskMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Batch load users for better performance
     */
    public List<UserDTO> getUsersBatch(List<Long> userIds) {
        return userRepository.findAllById(userIds).stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Preload frequently accessed data
     */
    @Scheduled(fixedRate = 300000) // Every 5 minutes
    public void preloadFrequentData() {
        // Preload active boards
        List<Board> activeBoards = boardRepository.findByArchivedFalse();
        activeBoards.forEach(board -> getCachedBoard(board.getId()));

        // Preload recent tasks
        List<Task> recentTasks = taskRepository.findAll().stream()
                .filter(task -> task.getCreatedAt() != null && 
                               task.getCreatedAt().isAfter(LocalDateTime.now().minusDays(7)))
                .collect(Collectors.toList());
        recentTasks.forEach(task -> getCachedTask(task.getId()));
    }

    /**
     * Clean up old cache entries
     */
    @Scheduled(fixedRate = 600000) // Every 10 minutes
    public void cleanupCache() {
        // This would typically be handled by the caching framework
        // For now, just a placeholder for cache cleanup logic
    }

    /**
     * Get performance metrics
     */
    public PerformanceMetrics getPerformanceMetrics() {
        PerformanceMetrics metrics = new PerformanceMetrics();
        
        // Get basic counts
        metrics.setTotalBoards(boardRepository.count());
        metrics.setTotalTasks(taskRepository.count());
        metrics.setTotalUsers(userRepository.count());
        
        // Get active data counts
        metrics.setActiveBoards(boardRepository.findByArchivedFalse().size());
        metrics.setRecentTasks(taskRepository.findAll().stream()
                .filter(task -> task.getCreatedAt() != null && 
                               task.getCreatedAt().isAfter(LocalDateTime.now().minusDays(7)))
                .count());
        
        return metrics;
    }

    /**
     * Optimize database queries
     */
    public void optimizeQueries() {
        // This would contain database optimization logic
        // For now, just a placeholder
    }

    // Performance metrics data class
    public static class PerformanceMetrics {
        private long totalBoards;
        private long totalTasks;
        private long totalUsers;
        private int activeBoards;
        private long recentTasks;
        private LocalDateTime lastOptimization;

        // Getters and setters
        public long getTotalBoards() { return totalBoards; }
        public void setTotalBoards(long totalBoards) { this.totalBoards = totalBoards; }
        public long getTotalTasks() { return totalTasks; }
        public void setTotalTasks(long totalTasks) { this.totalTasks = totalTasks; }
        public long getTotalUsers() { return totalUsers; }
        public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
        public int getActiveBoards() { return activeBoards; }
        public void setActiveBoards(int activeBoards) { this.activeBoards = activeBoards; }
        public long getRecentTasks() { return recentTasks; }
        public void setRecentTasks(long recentTasks) { this.recentTasks = recentTasks; }
        public LocalDateTime getLastOptimization() { return lastOptimization; }
        public void setLastOptimization(LocalDateTime lastOptimization) { this.lastOptimization = lastOptimization; }
    }
} 
