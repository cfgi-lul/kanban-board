package Backend.Board.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(nullable = false)
    private String type; // TASK_ASSIGNED, TASK_DUE, COMMENT_ADDED, etc.

    @Column(nullable = false)
    private boolean read = false;

    @Column(columnDefinition = "TEXT")
    private String data; // JSON string for additional notification data

    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender; // Can be null for system notifications

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task; // Can be null for general notifications

    @ManyToOne
    @JoinColumn(name = "board_id")
    private Board board; // Can be null for general notifications

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        if (read && readAt == null) {
            readAt = LocalDateTime.now();
        }
    }
} 