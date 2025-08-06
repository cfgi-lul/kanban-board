package com.kanban.board.application;

import com.kanban.board.domain.model.Board;
import com.kanban.task.domain.model.Task;
import com.kanban.task.domain.model.TaskStatus;
import com.kanban.task.domain.model.TaskPriority;
import com.kanban.user.domain.model.User;
import com.kanban.task.domain.repository.TaskRepository;
import com.kanban.board.domain.repository.BoardRepository;
import com.kanban.user.domain.repository.UserRepository;
import com.kanban.board.domain.repository.ColumnRepository;
import com.kanban.shared.infrastructure.CommentRepository;
import com.kanban.shared.infrastructure.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;




@Service
public class AnalyticsService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ColumnRepository columnRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    /**
     * Get board analytics
     */
    public BoardAnalytics getBoardAnalytics(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));

        BoardAnalytics analytics = new BoardAnalytics();
        analytics.setBoardId(boardId);
        analytics.setBoardName(board.getName());
        
        // Get all tasks for this board
        List<Task> boardTasks = taskRepository.findAll().stream()
                .filter(task -> task.getColumn() != null && 
                               task.getColumn().getBoard() != null && 
                               task.getColumn().getBoard().getId().equals(boardId))
                .collect(Collectors.toList());
        
        analytics.setTotalTasks(boardTasks.size());
        analytics.setTotalColumns(board.getColumns().size());
        analytics.setTotalUsers(board.getUsers() != null ? board.getUsers().size() : 0);
        analytics.setCreatedAt(board.getCreatedAt());
        analytics.setLastUpdated(board.getUpdatedAt());

        // Calculate task distribution by status
        Map<TaskStatus, Long> statusDistribution = boardTasks.stream()
                .collect(Collectors.groupingBy(Task::getStatus, Collectors.counting()));
        analytics.setStatusDistribution(statusDistribution);

        // Calculate task distribution by priority
        Map<TaskPriority, Long> priorityDistribution = boardTasks.stream()
                .collect(Collectors.groupingBy(Task::getPriority, Collectors.counting()));
        analytics.setPriorityDistribution(priorityDistribution);

        // Calculate overdue tasks
        long overdueTasks = boardTasks.stream()
                .filter(task -> task.getDueDate() != null && task.getDueDate().isBefore(LocalDateTime.now()))
                .count();
        analytics.setOverdueTasks(overdueTasks);

        // Calculate tasks due soon (next 7 days)
        long tasksDueSoon = boardTasks.stream()
                .filter(task -> task.getDueDate() != null && 
                               task.getDueDate().isAfter(LocalDateTime.now()) && 
                               task.getDueDate().isBefore(LocalDateTime.now().plusDays(7)))
                .count();
        analytics.setTasksDueSoon(tasksDueSoon);

        return analytics;
    }

    /**
     * Get user analytics
     */
    public UserAnalytics getUserAnalytics(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserAnalytics analytics = new UserAnalytics();
        analytics.setUserId(userId);
        analytics.setUsername(user.getUsername());
        analytics.setDisplayName(user.getDisplayName());

        // Get assigned tasks
        List<Task> assignedTasks = taskRepository.findAll().stream()
                .filter(task -> task.getAssignee() != null && task.getAssignee().getId().equals(userId))
                .collect(Collectors.toList());
        analytics.setAssignedTasks(assignedTasks.size());

        // Get created tasks
        List<Task> createdTasks = taskRepository.findAll().stream()
                .filter(task -> task.getCreatedBy() != null && task.getCreatedBy().getId().equals(userId))
                .collect(Collectors.toList());
        analytics.setCreatedTasks(createdTasks.size());

        // Get completed tasks
        long completedTasks = assignedTasks.stream()
                .filter(task -> task.getStatus() == TaskStatus.DONE)
                .count();
        analytics.setCompletedTasks((int) completedTasks);

        // Get overdue tasks
        long overdueTasks = assignedTasks.stream()
                .filter(task -> task.getDueDate() != null && task.getDueDate().isBefore(LocalDateTime.now()))
                .count();
        analytics.setOverdueTasks((int) overdueTasks);

        // Calculate completion rate
        if (assignedTasks.size() > 0) {
            double completionRate = (double) completedTasks / assignedTasks.size() * 100;
            analytics.setCompletionRate(completionRate);
        }

        // Get task distribution by status
        Map<TaskStatus, Long> statusDistribution = assignedTasks.stream()
                .collect(Collectors.groupingBy(Task::getStatus, Collectors.counting()));
        analytics.setStatusDistribution(statusDistribution);

        // Get task distribution by priority
        Map<TaskPriority, Long> priorityDistribution = assignedTasks.stream()
                .collect(Collectors.groupingBy(Task::getPriority, Collectors.counting()));
        analytics.setPriorityDistribution(priorityDistribution);

        return analytics;
    }

    /**
     * Get system-wide analytics
     */
    public SystemAnalytics getSystemAnalytics() {
        SystemAnalytics analytics = new SystemAnalytics();

        // Get total counts
        analytics.setTotalUsers(userRepository.count());
        analytics.setTotalBoards(boardRepository.count());
        analytics.setTotalTasks((int) taskRepository.count());
        analytics.setTotalComments(commentRepository.count());

        // Get active users (users with activity in last 30 days)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        long activeUsers = userRepository.findAll().stream()
                .filter(user -> user.getLastLoginAt() != null && user.getLastLoginAt().isAfter(thirtyDaysAgo))
                .count();
        analytics.setActiveUsers(activeUsers);

        // Get task statistics
        List<Task> allTasks = taskRepository.findAll();
        analytics.setTotalTasks((int) taskRepository.count());
        
        long completedTasks = allTasks.stream()
                .filter(task -> task.getStatus() == TaskStatus.DONE)
                .count();
        analytics.setCompletedTasks((int) completedTasks);

        long overdueTasks = allTasks.stream()
                .filter(task -> task.getDueDate() != null && task.getDueDate().isBefore(LocalDateTime.now()))
                .count();
        analytics.setOverdueTasks((int) overdueTasks);

        // Calculate average completion time
        double avgCompletionTime = allTasks.stream()
                .filter(task -> task.getStatus() == TaskStatus.DONE && task.getCreatedAt() != null)
                .mapToLong(task -> ChronoUnit.DAYS.between(task.getCreatedAt(), LocalDateTime.now()))
                .average()
                .orElse(0.0);
        analytics.setAverageCompletionTime(avgCompletionTime);

        // Get task distribution by status
        Map<TaskStatus, Long> statusDistribution = allTasks.stream()
                .collect(Collectors.groupingBy(Task::getStatus, Collectors.counting()));
        analytics.setStatusDistribution(statusDistribution);

        // Get task distribution by priority
        Map<TaskPriority, Long> priorityDistribution = allTasks.stream()
                .collect(Collectors.groupingBy(Task::getPriority, Collectors.counting()));
        analytics.setPriorityDistribution(priorityDistribution);

        return analytics;
    }

    /**
     * Get productivity metrics
     */
    public ProductivityMetrics getProductivityMetrics(Long boardId, LocalDateTime fromDate, LocalDateTime toDate) {
        ProductivityMetrics metrics = new ProductivityMetrics();
        metrics.setBoardId(boardId);
        metrics.setFromDate(fromDate);
        metrics.setToDate(toDate);

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));

        // Get tasks created in date range
        List<Task> tasksInRange = taskRepository.findAll().stream()
                .filter(task -> task.getColumn() != null && 
                               task.getColumn().getBoard() != null && 
                               task.getColumn().getBoard().getId().equals(boardId) &&
                               task.getCreatedAt() != null && 
                               task.getCreatedAt().isAfter(fromDate) && 
                               task.getCreatedAt().isBefore(toDate))
                .collect(Collectors.toList());

        metrics.setTasksCreated(tasksInRange.size());

        // Get tasks completed in date range
        long tasksCompleted = tasksInRange.stream()
                .filter(task -> task.getStatus() == TaskStatus.DONE)
                .count();
        metrics.setTasksCompleted((int) tasksCompleted);

        // Calculate completion rate
        if (tasksInRange.size() > 0) {
            double completionRate = (double) tasksCompleted / tasksInRange.size() * 100;
            metrics.setCompletionRate(completionRate);
        }

        // Calculate average task duration
        double avgTaskDuration = tasksInRange.stream()
                .filter(task -> task.getStatus() == TaskStatus.DONE && task.getCreatedAt() != null)
                .mapToLong(task -> ChronoUnit.DAYS.between(task.getCreatedAt(), LocalDateTime.now()))
                .average()
                .orElse(0.0);
        metrics.setAverageTaskDuration(avgTaskDuration);

        return metrics;
    }

    // Analytics data classes
    public static class BoardAnalytics {
        private Long boardId;
        private String boardName;
        private int totalTasks;
        private int totalColumns;
        private int totalUsers;
        private LocalDateTime createdAt;
        private LocalDateTime lastUpdated;
        private Map<TaskStatus, Long> statusDistribution;
        private Map<TaskPriority, Long> priorityDistribution;
        private long overdueTasks;
        private long tasksDueSoon;

        // Getters and setters
        public Long getBoardId() { return boardId; }
        public void setBoardId(Long boardId) { this.boardId = boardId; }
        public String getBoardName() { return boardName; }
        public void setBoardName(String boardName) { this.boardName = boardName; }
        public int getTotalTasks() { return totalTasks; }
        public void setTotalTasks(int totalTasks) { this.totalTasks = totalTasks; }
        public int getTotalColumns() { return totalColumns; }
        public void setTotalColumns(int totalColumns) { this.totalColumns = totalColumns; }
        public int getTotalUsers() { return totalUsers; }
        public void setTotalUsers(int totalUsers) { this.totalUsers = totalUsers; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
        public LocalDateTime getLastUpdated() { return lastUpdated; }
        public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
        public Map<TaskStatus, Long> getStatusDistribution() { return statusDistribution; }
        public void setStatusDistribution(Map<TaskStatus, Long> statusDistribution) { this.statusDistribution = statusDistribution; }
        public Map<TaskPriority, Long> getPriorityDistribution() { return priorityDistribution; }
        public void setPriorityDistribution(Map<TaskPriority, Long> priorityDistribution) { this.priorityDistribution = priorityDistribution; }
        public long getOverdueTasks() { return overdueTasks; }
        public void setOverdueTasks(long overdueTasks) { this.overdueTasks = overdueTasks; }
        public long getTasksDueSoon() { return tasksDueSoon; }
        public void setTasksDueSoon(long tasksDueSoon) { this.tasksDueSoon = tasksDueSoon; }
    }

    public static class UserAnalytics {
        private Long userId;
        private String username;
        private String displayName;
        private int assignedTasks;
        private int createdTasks;
        private int completedTasks;
        private int overdueTasks;
        private double completionRate;
        private Map<TaskStatus, Long> statusDistribution;
        private Map<TaskPriority, Long> priorityDistribution;

        // Getters and setters
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getDisplayName() { return displayName; }
        public void setDisplayName(String displayName) { this.displayName = displayName; }
        public int getAssignedTasks() { return assignedTasks; }
        public void setAssignedTasks(int assignedTasks) { this.assignedTasks = assignedTasks; }
        public int getCreatedTasks() { return createdTasks; }
        public void setCreatedTasks(int createdTasks) { this.createdTasks = createdTasks; }
        public int getCompletedTasks() { return completedTasks; }
        public void setCompletedTasks(int completedTasks) { this.completedTasks = completedTasks; }
        public int getOverdueTasks() { return overdueTasks; }
        public void setOverdueTasks(int overdueTasks) { this.overdueTasks = overdueTasks; }
        public double getCompletionRate() { return completionRate; }
        public void setCompletionRate(double completionRate) { this.completionRate = completionRate; }
        public Map<TaskStatus, Long> getStatusDistribution() { return statusDistribution; }
        public void setStatusDistribution(Map<TaskStatus, Long> statusDistribution) { this.statusDistribution = statusDistribution; }
        public Map<TaskPriority, Long> getPriorityDistribution() { return priorityDistribution; }
        public void setPriorityDistribution(Map<TaskPriority, Long> priorityDistribution) { this.priorityDistribution = priorityDistribution; }
    }

    public static class SystemAnalytics {
        private long totalUsers;
        private long activeUsers;
        private long totalBoards;
        private int totalTasks;
        private int completedTasks;
        private int overdueTasks;
        private long totalComments;
        private double averageCompletionTime;
        private Map<TaskStatus, Long> statusDistribution;
        private Map<TaskPriority, Long> priorityDistribution;

        // Getters and setters
        public long getTotalUsers() { return totalUsers; }
        public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
        public long getActiveUsers() { return activeUsers; }
        public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }
        public long getTotalBoards() { return totalBoards; }
        public void setTotalBoards(long totalBoards) { this.totalBoards = totalBoards; }
        public int getTotalTasks() { return totalTasks; }
        public void setTotalTasks(int totalTasks) { this.totalTasks = totalTasks; }
        public int getCompletedTasks() { return completedTasks; }
        public void setCompletedTasks(int completedTasks) { this.completedTasks = completedTasks; }
        public int getOverdueTasks() { return overdueTasks; }
        public void setOverdueTasks(int overdueTasks) { this.overdueTasks = overdueTasks; }
        public long getTotalComments() { return totalComments; }
        public void setTotalComments(long totalComments) { this.totalComments = totalComments; }
        public double getAverageCompletionTime() { return averageCompletionTime; }
        public void setAverageCompletionTime(double averageCompletionTime) { this.averageCompletionTime = averageCompletionTime; }
        public Map<TaskStatus, Long> getStatusDistribution() { return statusDistribution; }
        public void setStatusDistribution(Map<TaskStatus, Long> statusDistribution) { this.statusDistribution = statusDistribution; }
        public Map<TaskPriority, Long> getPriorityDistribution() { return priorityDistribution; }
        public void setPriorityDistribution(Map<TaskPriority, Long> priorityDistribution) { this.priorityDistribution = priorityDistribution; }
    }

    public static class ProductivityMetrics {
        private Long boardId;
        private LocalDateTime fromDate;
        private LocalDateTime toDate;
        private int tasksCreated;
        private int tasksCompleted;
        private double completionRate;
        private double averageTaskDuration;

        // Getters and setters
        public Long getBoardId() { return boardId; }
        public void setBoardId(Long boardId) { this.boardId = boardId; }
        public LocalDateTime getFromDate() { return fromDate; }
        public void setFromDate(LocalDateTime fromDate) { this.fromDate = fromDate; }
        public LocalDateTime getToDate() { return toDate; }
        public void setToDate(LocalDateTime toDate) { this.toDate = toDate; }
        public int getTasksCreated() { return tasksCreated; }
        public void setTasksCreated(int tasksCreated) { this.tasksCreated = tasksCreated; }
        public int getTasksCompleted() { return tasksCompleted; }
        public void setTasksCompleted(int tasksCompleted) { this.tasksCompleted = tasksCompleted; }
        public double getCompletionRate() { return completionRate; }
        public void setCompletionRate(double completionRate) { this.completionRate = completionRate; }
        public double getAverageTaskDuration() { return averageTaskDuration; }
        public void setAverageTaskDuration(double averageTaskDuration) { this.averageTaskDuration = averageTaskDuration; }
    }
} 
