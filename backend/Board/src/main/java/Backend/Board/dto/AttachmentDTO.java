package Backend.Board.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AttachmentDTO {
    private Long id;
    
    @NotBlank(message = "Filename is required")
    private String filename;
    
    @NotBlank(message = "Original filename is required")
    private String originalFilename;
    
    @NotBlank(message = "File URL is required")
    private String fileUrl;
    
    @NotBlank(message = "Content type is required")
    private String contentType;
    
    @NotNull(message = "File size is required")
    @Positive(message = "File size must be positive")
    private Long fileSize;
    
    private Long taskId;
    
    private UserDTO uploadedBy;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Constructor for attachment creation
    public AttachmentDTO(String filename, String originalFilename, String fileUrl, 
                        String contentType, Long fileSize, Long taskId) {
        this.filename = filename;
        this.originalFilename = originalFilename;
        this.fileUrl = fileUrl;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.taskId = taskId;
    }
    
    // Constructor for attachment preview (minimal data)
    public AttachmentDTO(Long id, String filename, String originalFilename, Long fileSize) {
        this.id = id;
        this.filename = filename;
        this.originalFilename = originalFilename;
        this.fileSize = fileSize;
    }
    
    // Constructor for full attachment response
    public AttachmentDTO(Long id, String filename, String originalFilename, String fileUrl,
                        String contentType, Long fileSize, Long taskId, UserDTO uploadedBy,
                        LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.filename = filename;
        this.originalFilename = originalFilename;
        this.fileUrl = fileUrl;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.taskId = taskId;
        this.uploadedBy = uploadedBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
} 