package Backend.Board.controller;

import Backend.Board.dto.UserDTO;
import Backend.Board.exception.ResourceNotFoundException;
import Backend.Board.mappers.UserMapper;
import Backend.Board.model.User;
import Backend.Board.repository.UserRepository;
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
import java.util.UUID;

@RestController
@RequestMapping("/avatar")
public class AvatarController {

    @Autowired
    private UserRepository userRepository;

    @Value("${app.avatar.upload-dir:uploads/avatars}")
    private String uploadDir;

    @Value("${app.avatar.max-size:5242880}") // 5MB default
    private long maxFileSize;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserDTO> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Validate file
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (file.getSize() > maxFileSize) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).build();
        }

        // Check file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().build();
        }

        try {
            // Get current user
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + fileExtension;

            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);

            // Update user avatar URL
            String avatarUrl = filename;
            user.setAvatar(avatarUrl);
            User updatedUser = userRepository.save(user);

            return ResponseEntity.ok(UserMapper.toDTO(updatedUser));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{filename}")
    public ResponseEntity<byte[]> getAvatar(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename);
            
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            byte[] imageBytes = Files.readAllBytes(filePath);
            String contentType = determineContentType(filename);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(imageBytes);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/remove")
    public ResponseEntity<UserDTO> removeAvatar(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            // Remove old avatar file if exists
            if (user.getAvatar() != null && user.getAvatar().startsWith("/avatar/")) {
                String filename = user.getAvatar().substring("/avatar/".length());
                Path filePath = Paths.get(uploadDir).resolve(filename);
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                }
            }

            // Clear avatar URL
            user.setAvatar(null);
            User updatedUser = userRepository.save(user);

            return ResponseEntity.ok(UserMapper.toDTO(updatedUser));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private String determineContentType(String filename) {
        if (filename.toLowerCase().endsWith(".png")) {
            return "image/png";
        } else if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (filename.toLowerCase().endsWith(".gif")) {
            return "image/gif";
        } else if (filename.toLowerCase().endsWith(".webp")) {
            return "image/webp";
        } else {
            return "image/jpeg"; // Default
        }
    }
} 