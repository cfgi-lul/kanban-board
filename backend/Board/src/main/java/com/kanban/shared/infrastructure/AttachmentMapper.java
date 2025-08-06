package com.kanban.shared.infrastructure;

import com.kanban.shared.interfaces.rest.AttachmentDTO;
import com.kanban.shared.domain.model.Attachment;



public class AttachmentMapper {
    public static AttachmentDTO toDTO(Attachment attachment) {
        if (attachment == null) {
            return null;
        }
        
        return new AttachmentDTO(
            attachment.getId(),
            attachment.getFilename(),
            attachment.getOriginalFilename(),
            attachment.getFileUrl(),
            attachment.getContentType(),
            attachment.getFileSize(),
            attachment.getTask() != null ? attachment.getTask().getId() : null,
            UserMapper.toDTO(attachment.getUploadedBy()),
            attachment.getCreatedAt(),
            attachment.getUpdatedAt()
        );
    }

    public static AttachmentDTO toPreviewDTO(Attachment attachment) {
        if (attachment == null) {
            return null;
        }
        return new AttachmentDTO(
            attachment.getId(),
            attachment.getFilename(),
            attachment.getOriginalFilename(),
            attachment.getFileSize()
        );
    }

    public static Attachment toEntity(AttachmentDTO attachmentDTO) {
        if (attachmentDTO == null) {
            return null;
        }
        
        Attachment attachment = new Attachment();
        attachment.setId(attachmentDTO.getId());
        attachment.setFilename(attachmentDTO.getFilename());
        attachment.setOriginalFilename(attachmentDTO.getOriginalFilename());
        attachment.setFileUrl(attachmentDTO.getFileUrl());
        attachment.setContentType(attachmentDTO.getContentType());
        attachment.setFileSize(attachmentDTO.getFileSize());
        attachment.setCreatedAt(attachmentDTO.getCreatedAt());
        attachment.setUpdatedAt(attachmentDTO.getUpdatedAt());
        // Task and uploadedBy should be set in service layer
        return attachment;
    }
} 
