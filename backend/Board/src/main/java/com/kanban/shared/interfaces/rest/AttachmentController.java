package com.kanban.shared.interfaces.rest;

import com.kanban.shared.domain.exception.ResourceNotFoundException;
import com.kanban.shared.infrastructure.AttachmentMapper;
import com.kanban.shared.domain.model.Attachment;
import com.kanban.task.domain.model.Task;
import com.kanban.user.domain.model.User;
import com.kanban.shared.infrastructure.AttachmentRepository;
import com.kanban.task.domain.repository.TaskRepository;
import com.kanban.user.domain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;




@RestController
@RequestMapping("/attachments")
public class AttachmentController {

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<AttachmentDTO>> getAttachmentsByTask(@PathVariable Long taskId) {
        List<Attachment> attachments = attachmentRepository.findByTaskIdOrderByCreatedAtDesc(taskId);
        List<AttachmentDTO> attachmentDTOs = attachments.stream()
                .map(AttachmentMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(attachmentDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttachmentDTO> getAttachmentById(@PathVariable Long id) {
        return attachmentRepository.findById(id)
                .map(AttachmentMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AttachmentDTO> createAttachment(@RequestBody AttachmentDTO attachmentDTO,
                                                         @AuthenticationPrincipal UserDetails userDetails) {
        // Validate the attachment data
        if (attachmentDTO.getFilename() == null || attachmentDTO.getFilename().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (attachmentDTO.getOriginalFilename() == null || attachmentDTO.getOriginalFilename().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (attachmentDTO.getFileUrl() == null || attachmentDTO.getFileUrl().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (attachmentDTO.getContentType() == null || attachmentDTO.getContentType().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (attachmentDTO.getFileSize() == null || attachmentDTO.getFileSize() <= 0) {
            return ResponseEntity.badRequest().build();
        }

        if (attachmentDTO.getTaskId() == null) {
            return ResponseEntity.badRequest().build();
        }

        // Check if task exists
        Task task = taskRepository.findById(attachmentDTO.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        // Get the user who uploaded the attachment
        User uploadedBy = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Attachment attachment = AttachmentMapper.toEntity(attachmentDTO);
        attachment.setTask(task);
        attachment.setUploadedBy(uploadedBy);

        Attachment savedAttachment = attachmentRepository.save(attachment);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(AttachmentMapper.toDTO(savedAttachment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttachment(@PathVariable Long id,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        return attachmentRepository.findById(id)
                .map(attachment -> {
                    // Check if user is the one who uploaded the attachment
                    if (!attachment.getUploadedBy().getUsername().equals(userDetails.getUsername())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).<Void>build();
                    }

                    attachmentRepository.delete(attachment);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AttachmentDTO>> getAttachmentsByUser(@PathVariable Long userId) {
        List<Attachment> attachments = attachmentRepository.findByUploadedByIdOrderByCreatedAtDesc(userId);
        List<AttachmentDTO> attachmentDTOs = attachments.stream()
                .map(AttachmentMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(attachmentDTOs);
    }

    @GetMapping("/content-type/{contentType}")
    public ResponseEntity<List<AttachmentDTO>> getAttachmentsByContentType(@PathVariable String contentType) {
        List<Attachment> attachments = attachmentRepository.findByContentType(contentType);
        List<AttachmentDTO> attachmentDTOs = attachments.stream()
                .map(AttachmentMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(attachmentDTOs);
    }
} 
