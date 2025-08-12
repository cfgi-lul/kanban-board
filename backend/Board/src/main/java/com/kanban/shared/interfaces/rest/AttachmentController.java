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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
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

    @Value("${app.attachment.upload-dir:uploads/attachments}")
    private String uploadDir;

    @Value("${app.attachment.max-size:10485760}") // 10MB default
    private long maxFileSize;

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

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AttachmentDTO> uploadAttachment(
            @RequestParam("file") MultipartFile file,
            @RequestParam("taskId") Long taskId,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (file.getSize() > maxFileSize) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).build();
        }

        try {
            // Validate task and user
            Task task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

            User uploadedBy = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            // Ensure upload directory exists
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename preserving extension
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String storedFilename = java.util.UUID.randomUUID().toString() + fileExtension;

            // Save file contents
            Path filePath = uploadPath.resolve(storedFilename);
            Files.copy(file.getInputStream(), filePath);

            // Build and save Attachment entity
            Attachment attachment = new Attachment();
            attachment.setFilename(storedFilename);
            attachment.setOriginalFilename(originalFilename != null ? originalFilename : storedFilename);
            // Store only stored filename as URL token similar to AvatarController
            attachment.setFileUrl(storedFilename);
            attachment.setContentType(file.getContentType() != null ? file.getContentType() : "application/octet-stream");
            attachment.setFileSize(file.getSize());
            attachment.setTask(task);
            attachment.setUploadedBy(uploadedBy);

            Attachment saved = attachmentRepository.save(attachment);
            return ResponseEntity.status(HttpStatus.CREATED).body(AttachmentMapper.toDTO(saved));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadAttachment(@PathVariable Long id) {
        Optional<Attachment> optionalAttachment = attachmentRepository.findById(id);
        if (optionalAttachment.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Attachment attachment = optionalAttachment.get();
        try {
            Path filePath = Paths.get(uploadDir).resolve(attachment.getFileUrl());
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }
            byte[] bytes = Files.readAllBytes(filePath);
            MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
            try {
                mediaType = MediaType.parseMediaType(attachment.getContentType());
            } catch (Exception ignored) { }

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header("Content-Disposition", "attachment; filename=\"" + attachment.getOriginalFilename() + "\"")
                    .body(bytes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 
