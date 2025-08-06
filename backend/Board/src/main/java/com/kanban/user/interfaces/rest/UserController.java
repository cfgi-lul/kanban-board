package com.kanban.user.interfaces.rest;

import com.kanban.user.domain.repository.RoleRepository;
import com.kanban.shared.domain.exception.ResourceNotFoundException;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.kanban.shared.infrastructure.UserMapper;
import com.kanban.user.domain.model.Role;
import com.kanban.user.domain.model.User;
import com.kanban.user.domain.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;







@RestController
@RequestMapping("/users")
@Tag(name = "Users", description = "User management operations")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @GetMapping
    @Operation(summary = "Get all users", description = "Retrieve a list of all users or a specific user by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved users"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    public List<UserDTO> getAllUsers(@Parameter(description = "Optional user ID to retrieve specific user") @RequestParam(required = false) Long id) {
        List<User> users;
        if (id != null) {
            users = userRepository.findById(id).map(List::of).orElseThrow(() -> new RuntimeException("User not found"));
        } else {
            users = userRepository.findAll();
        }
        return users.stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/current")
    @Operation(summary = "Get current user", description = "Retrieve the currently authenticated user's information")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved current user"),
        @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return ResponseEntity.ok(UserMapper.toDTO(user));
    }

    @PutMapping("/current")
    @Operation(summary = "Update current user", description = "Update the currently authenticated user's information")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully updated user"),
        @ApiResponse(responseCode = "401", description = "User not authenticated"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<UserDTO> updateCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "User data to update") @RequestBody UserDTO updateRequest) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Update allowed fields
        if (updateRequest.getDisplayName() != null) {
            user.setDisplayName(updateRequest.getDisplayName());
        }
        if (updateRequest.getEmail() != null) {
            user.setEmail(updateRequest.getEmail());
        }
        if (updateRequest.getAvatar() != null) {
            user.setAvatar(updateRequest.getAvatar());
        }

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(UserMapper.toDTO(updatedUser));
    }

    @PostMapping("/{userId}/promote-to-admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Promote user to admin", description = "Promote a user to admin role (Admin only)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully promoted user to admin"),
        @ApiResponse(responseCode = "403", description = "Access denied"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<?> promoteToAdmin(@Parameter(description = "ID of the user to promote") @PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseThrow(() -> new RuntimeException("Admin role not found"));

        user.getRoles().add(adminRole);
        userRepository.save(user);
        return ResponseEntity.ok("User promoted to admin");
    }

    @PostMapping
    @Operation(summary = "Create new user", description = "Create a new user account")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully created user"),
        @ApiResponse(responseCode = "400", description = "Invalid user data")
    })
    public ResponseEntity<UserDTO> createUser(@Parameter(description = "User data for registration") @RequestBody UserDTO userDTO) {
        User user = UserMapper.toEntity(userDTO);
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(UserMapper.toDTO(savedUser));
    }

    @DeleteMapping
    @Operation(summary = "Delete user", description = "Delete a user by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully deleted user"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    public void deleteUser(@Parameter(description = "ID of the user to delete") @RequestParam Long id) {
        userRepository.deleteById(id);
    }
}
