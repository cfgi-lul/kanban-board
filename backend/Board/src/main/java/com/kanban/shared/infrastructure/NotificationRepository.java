package com.kanban.shared.infrastructure;

import com.kanban.shared.domain.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;




@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    /**
     * Find all notifications by recipient ID
     */
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);
    
    /**
     * Find unread notifications by recipient ID
     */
    List<Notification> findByRecipientIdAndReadFalseOrderByCreatedAtDesc(Long recipientId);
    
    /**
     * Find notifications by type
     */
    List<Notification> findByTypeOrderByCreatedAtDesc(String type);
    
    /**
     * Find notifications by recipient ID and type
     */
    List<Notification> findByRecipientIdAndTypeOrderByCreatedAtDesc(Long recipientId, String type);
    
    /**
     * Find notifications by task ID
     */
    List<Notification> findByTaskIdOrderByCreatedAtDesc(Long taskId);
    
    /**
     * Find notifications by board ID
     */
    List<Notification> findByBoardIdOrderByCreatedAtDesc(Long boardId);
    
    /**
     * Count unread notifications by recipient ID
     */
    long countByRecipientIdAndReadFalse(Long recipientId);
    
    /**
     * Find notifications by recipient ID with pagination
     */
    Page<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId, Pageable pageable);
    
    /**
     * Find unread notifications by recipient ID with pagination
     */
    Page<Notification> findByRecipientIdAndReadFalseOrderByCreatedAtDesc(Long recipientId, Pageable pageable);
    
    /**
     * Mark notifications as read by recipient ID
     */
    @Query("UPDATE Notification n SET n.read = true, n.readAt = CURRENT_TIMESTAMP WHERE n.recipient.id = :recipientId AND n.read = false")
    void markAllAsReadByRecipientId(@Param("recipientId") Long recipientId);
} 
