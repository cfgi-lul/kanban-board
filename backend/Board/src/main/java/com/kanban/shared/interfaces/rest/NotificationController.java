package com.kanban.shared.interfaces.rest;

import com.kanban.shared.domain.exception.ResourceNotFoundException;
import com.kanban.shared.infrastructure.NotificationMapper;
import com.kanban.shared.domain.model.Notification;
import com.kanban.user.domain.model.User;
import com.kanban.shared.infrastructure.NotificationRepository;
import com.kanban.user.domain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;




@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user")
    public ResponseEntity<List<NotificationDTO>> getUserNotifications(@AuthenticationPrincipal UserDetails userDetails,
                                                                    @RequestParam(defaultValue = "0") int page,
                                                                    @RequestParam(defaultValue = "20") int size) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notifications = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(user.getId(), pageable);
        
        List<NotificationDTO> notificationDTOs = notifications.getContent().stream()
                .map(NotificationMapper::toDTO)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(notificationDTOs);
    }

    @GetMapping("/user/unread")
    public ResponseEntity<List<NotificationDTO>> getUserUnreadNotifications(@AuthenticationPrincipal UserDetails userDetails,
                                                                          @RequestParam(defaultValue = "0") int page,
                                                                          @RequestParam(defaultValue = "20") int size) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notifications = notificationRepository.findByRecipientIdAndReadFalseOrderByCreatedAtDesc(user.getId(), pageable);
        
        List<NotificationDTO> notificationDTOs = notifications.getContent().stream()
                .map(NotificationMapper::toDTO)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(notificationDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationDTO> getNotificationById(@PathVariable Long id,
                                                             @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return notificationRepository.findById(id)
                .map(notification -> {
                    // Check if user is the recipient
                    if (!notification.getRecipient().getId().equals(user.getId())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).<NotificationDTO>build();
                    }
                    return ResponseEntity.ok(NotificationMapper.toDTO(notification));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(@RequestBody NotificationDTO notificationDTO,
                                                            @AuthenticationPrincipal UserDetails userDetails) {
        // Validate the notification data
        if (notificationDTO.getTitle() == null || notificationDTO.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (notificationDTO.getMessage() == null || notificationDTO.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (notificationDTO.getType() == null || notificationDTO.getType().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (notificationDTO.getRecipientId() == null) {
            return ResponseEntity.badRequest().build();
        }

        // Check if recipient exists
        User recipient = userRepository.findById(notificationDTO.getRecipientId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found"));

        // Get the sender (current user)
        User sender = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Notification notification = NotificationMapper.toEntity(notificationDTO);
        notification.setRecipient(recipient);
        notification.setSender(sender);

        Notification savedNotification = notificationRepository.save(notification);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(NotificationMapper.toDTO(savedNotification));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationDTO> markAsRead(@PathVariable Long id,
                                                     @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return notificationRepository.findById(id)
                .map(notification -> {
                    // Check if user is the recipient
                    if (!notification.getRecipient().getId().equals(user.getId())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).<NotificationDTO>build();
                    }

                    notification.setRead(true);
                    Notification savedNotification = notificationRepository.save(notification);
                    return ResponseEntity.ok(NotificationMapper.toDTO(savedNotification));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/user/read-all")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        notificationRepository.markAllAsReadByRecipientId(user.getId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id,
                                                 @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return notificationRepository.findById(id)
                .map(notification -> {
                    // Check if user is the recipient
                    if (!notification.getRecipient().getId().equals(user.getId())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).<Void>build();
                    }

                    notificationRepository.delete(notification);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/count/unread")
    public ResponseEntity<Long> getUnreadCount(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        long count = notificationRepository.countByRecipientIdAndReadFalse(user.getId());
        return ResponseEntity.ok(count);
    }
} 
