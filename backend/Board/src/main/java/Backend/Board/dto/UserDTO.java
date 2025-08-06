package Backend.Board.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "User data transfer object for API communication")
public class UserDTO {
    @Schema(description = "Unique identifier for the user", example = "1")
    private Long id;
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Schema(description = "Username for authentication", example = "john_doe", required = true)
    private String username;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    @Schema(description = "User password (only for registration/update)", example = "password123")
    private String password;
    
    @Size(min = 2, max = 100, message = "Display name must be between 2 and 100 characters")
    @Schema(description = "Display name shown to other users", example = "John Doe")
    private String displayName;
    
    @Email(message = "Email should be valid")
    @Schema(description = "User email address", example = "john.doe@example.com")
    private String email;
    
    @Schema(description = "URL to user's avatar image", example = "https://example.com/avatar.jpg")
    private String avatar;
    
    @Schema(description = "Timestamp of last login", example = "2024-01-15T10:30:00")
    private LocalDateTime lastLoginAt;
    
    @Schema(description = "Timestamp when user was created", example = "2024-01-01T00:00:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "Timestamp when user was last updated", example = "2024-01-15T10:30:00")
    private LocalDateTime updatedAt;
    
    @Schema(description = "Whether the user account is enabled", example = "true")
    private boolean enabled = true;
    
    // Legacy field for backward compatibility
    @Schema(description = "Legacy name field (deprecated)", example = "John Doe")
    private String name;
    
    @Schema(description = "List of roles assigned to the user")
    private List<RoleDTO> roles;
    
    // Constructor for registration
    public UserDTO(String username, String password, String displayName, String email) {
        this.username = username;
        this.password = password;
        this.displayName = displayName;
        this.email = email;
    }
    
    // Constructor for response (without password)
    public UserDTO(Long id, String username, String displayName, String email, String avatar, 
                   LocalDateTime lastLoginAt, LocalDateTime createdAt, LocalDateTime updatedAt, 
                   boolean enabled, String name, List<RoleDTO> roles) {
        this.id = id;
        this.username = username;
        this.displayName = displayName;
        this.email = email;
        this.avatar = avatar;
        this.lastLoginAt = lastLoginAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.enabled = enabled;
        this.name = name;
        this.roles = roles;
    }
}