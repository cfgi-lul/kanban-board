package Backend.Board.controller;

import Backend.Board.dto.BoardDTO;
import Backend.Board.dto.TaskDTO;
import Backend.Board.dto.UserDTO;
import Backend.Board.service.PerformanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/performance")
public class PerformanceController {

    @Autowired
    private PerformanceService performanceService;

    /**
     * Get cached board data
     */
    @GetMapping("/cache/board/{boardId}")
    public ResponseEntity<BoardDTO> getCachedBoard(@PathVariable Long boardId) {
        BoardDTO board = performanceService.getCachedBoard(boardId);
        return board != null ? ResponseEntity.ok(board) : ResponseEntity.notFound().build();
    }

    /**
     * Get cached user data
     */
    @GetMapping("/cache/user/{userId}")
    public ResponseEntity<UserDTO> getCachedUser(@PathVariable Long userId) {
        UserDTO user = performanceService.getCachedUser(userId);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    /**
     * Get cached task data
     */
    @GetMapping("/cache/task/{taskId}")
    public ResponseEntity<TaskDTO> getCachedTask(@PathVariable Long taskId) {
        TaskDTO task = performanceService.getCachedTask(taskId);
        return task != null ? ResponseEntity.ok(task) : ResponseEntity.notFound().build();
    }

    /**
     * Get board data asynchronously
     */
    @GetMapping("/async/board/{boardId}")
    public CompletableFuture<ResponseEntity<BoardDTO>> getBoardAsync(@PathVariable Long boardId) {
        return performanceService.getBoardAsync(boardId)
                .thenApply(board -> board != null ? ResponseEntity.ok(board) : ResponseEntity.notFound().build());
    }

    /**
     * Get tasks data asynchronously
     */
    @PostMapping("/async/tasks")
    public CompletableFuture<ResponseEntity<List<TaskDTO>>> getTasksAsync(@RequestBody List<Long> taskIds) {
        return performanceService.getTasksAsync(taskIds)
                .thenApply(tasks -> ResponseEntity.ok(tasks));
    }

    /**
     * Batch load boards
     */
    @PostMapping("/batch/boards")
    public ResponseEntity<List<BoardDTO>> getBoardsBatch(@RequestBody List<Long> boardIds) {
        List<BoardDTO> boards = performanceService.getBoardsBatch(boardIds);
        return ResponseEntity.ok(boards);
    }

    /**
     * Batch load tasks
     */
    @PostMapping("/batch/tasks")
    public ResponseEntity<List<TaskDTO>> getTasksBatch(@RequestBody List<Long> taskIds) {
        List<TaskDTO> tasks = performanceService.getTasksBatch(taskIds);
        return ResponseEntity.ok(tasks);
    }

    /**
     * Batch load users
     */
    @PostMapping("/batch/users")
    public ResponseEntity<List<UserDTO>> getUsersBatch(@RequestBody List<Long> userIds) {
        List<UserDTO> users = performanceService.getUsersBatch(userIds);
        return ResponseEntity.ok(users);
    }

    /**
     * Get performance metrics
     */
    @GetMapping("/metrics")
    public ResponseEntity<PerformanceService.PerformanceMetrics> getPerformanceMetrics() {
        PerformanceService.PerformanceMetrics metrics = performanceService.getPerformanceMetrics();
        return ResponseEntity.ok(metrics);
    }

    /**
     * Evict board cache
     */
    @DeleteMapping("/cache/board/{boardId}")
    public ResponseEntity<Void> evictBoardCache(@PathVariable Long boardId) {
        performanceService.evictBoardCache(boardId);
        return ResponseEntity.ok().build();
    }

    /**
     * Evict user cache
     */
    @DeleteMapping("/cache/user/{userId}")
    public ResponseEntity<Void> evictUserCache(@PathVariable Long userId) {
        performanceService.evictUserCache(userId);
        return ResponseEntity.ok().build();
    }

    /**
     * Evict task cache
     */
    @DeleteMapping("/cache/task/{taskId}")
    public ResponseEntity<Void> evictTaskCache(@PathVariable Long taskId) {
        performanceService.evictTaskCache(taskId);
        return ResponseEntity.ok().build();
    }

    /**
     * Optimize database queries
     */
    @PostMapping("/optimize")
    public ResponseEntity<Void> optimizeQueries() {
        performanceService.optimizeQueries();
        return ResponseEntity.ok().build();
    }

    /**
     * Preload frequent data
     */
    @PostMapping("/preload")
    public ResponseEntity<Void> preloadFrequentData() {
        performanceService.preloadFrequentData();
        return ResponseEntity.ok().build();
    }
} 