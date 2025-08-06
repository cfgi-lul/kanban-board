package Backend.Board.service;

import Backend.Board.model.Notification;
import Backend.Board.model.User;
import Backend.Board.repository.NotificationRepository;
import Backend.Board.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Create a notification for task assignment
     */
    public void createTaskAssignedNotification(User assignee, Long taskId, String taskTitle, User assignedBy) {
        Notification notification = new Notification();
        notification.setTitle("Task Assigned");
        notification.setMessage("You have been assigned to task: " + taskTitle);
        notification.setType("TASK_ASSIGNED");
        notification.setRecipient(assignee);
        notification.setSender(assignedBy);
        // Note: Task object would need to be fetched if needed
        // For now, we'll just store the taskId in the data field
        notification.setData("{\"taskId\": " + taskId + "}");
        notification.setCreatedAt(LocalDateTime.now());
        
        notificationRepository.save(notification);
    }

    /**
     * Create a notification for task due date
     */
    public void createTaskDueNotification(User assignee, Long taskId, String taskTitle) {
        Notification notification = new Notification();
        notification.setTitle("Task Due Soon");
        notification.setMessage("Task '" + taskTitle + "' is due soon");
        notification.setType("TASK_DUE");
        notification.setRecipient(assignee);
        notification.setData("{\"taskId\": " + taskId + "}");
        notification.setCreatedAt(LocalDateTime.now());
        
        notificationRepository.save(notification);
    }

    /**
     * Create a notification for new comment
     */
    public void createCommentAddedNotification(User taskAssignee, Long taskId, String taskTitle, User commentAuthor) {
        if (taskAssignee != null && !taskAssignee.getId().equals(commentAuthor.getId())) {
            Notification notification = new Notification();
            notification.setTitle("New Comment");
            notification.setMessage("A new comment was added to task: " + taskTitle);
            notification.setType("COMMENT_ADDED");
            notification.setRecipient(taskAssignee);
            notification.setSender(commentAuthor);
            notification.setData("{\"taskId\": " + taskId + "}");
            notification.setCreatedAt(LocalDateTime.now());
            
            notificationRepository.save(notification);
        }
    }

    /**
     * Create a notification for board invitation
     */
    public void createBoardInvitationNotification(User recipient, Long boardId, String boardName, User inviter) {
        Notification notification = new Notification();
        notification.setTitle("Board Invitation");
        notification.setMessage("You have been invited to join board: " + boardName);
        notification.setType("BOARD_INVITATION");
        notification.setRecipient(recipient);
        notification.setSender(inviter);
        notification.setData("{\"boardId\": " + boardId + "}");
        notification.setCreatedAt(LocalDateTime.now());
        
        notificationRepository.save(notification);
    }

    /**
     * Mark all notifications as read for a user
     */
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadByRecipientId(userId);
    }

    /**
     * Get unread notification count for a user
     */
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientIdAndReadFalse(userId);
    }

    /**
     * Delete old notifications (cleanup)
     */
    public void deleteOldNotifications(int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        // Implementation would depend on your repository method
        // notificationRepository.deleteByCreatedAtBefore(cutoffDate);
    }
} 