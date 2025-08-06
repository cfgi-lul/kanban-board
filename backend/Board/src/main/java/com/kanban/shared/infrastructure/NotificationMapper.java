package com.kanban.shared.infrastructure;

import com.kanban.shared.interfaces.rest.NotificationDTO;
import com.kanban.shared.domain.model.Notification;



public class NotificationMapper {
    public static NotificationDTO toDTO(Notification notification) {
        if (notification == null) {
            return null;
        }
        
        return new NotificationDTO(
            notification.getId(),
            notification.getTitle(),
            notification.getMessage(),
            notification.getType(),
            notification.isRead(),
            notification.getData(),
            notification.getRecipient() != null ? notification.getRecipient().getId() : null,
            notification.getSender() != null ? notification.getSender().getId() : null,
            notification.getTask() != null ? notification.getTask().getId() : null,
            notification.getBoard() != null ? notification.getBoard().getId() : null,
            UserMapper.toDTO(notification.getRecipient()),
            UserMapper.toDTO(notification.getSender()),
            notification.getCreatedAt(),
            notification.getReadAt()
        );
    }

    public static NotificationDTO toPreviewDTO(Notification notification) {
        if (notification == null) {
            return null;
        }
        return new NotificationDTO(
            notification.getId(),
            notification.getTitle(),
            notification.getMessage(),
            notification.isRead(),
            notification.getCreatedAt()
        );
    }

    public static Notification toEntity(NotificationDTO notificationDTO) {
        if (notificationDTO == null) {
            return null;
        }
        
        Notification notification = new Notification();
        notification.setId(notificationDTO.getId());
        notification.setTitle(notificationDTO.getTitle());
        notification.setMessage(notificationDTO.getMessage());
        notification.setType(notificationDTO.getType());
        notification.setRead(notificationDTO.isRead());
        notification.setData(notificationDTO.getData());
        notification.setCreatedAt(notificationDTO.getCreatedAt());
        notification.setReadAt(notificationDTO.getReadAt());
        // Recipient, sender, task, and board should be set in service layer
        return notification;
    }
} 
