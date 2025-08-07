package com.kanban.user.interfaces.rest;

import com.kanban.user.domain.repository.RoleRepository;
import com.kanban.shared.infrastructure.config.JwtUtil;
import com.kanban.shared.infrastructure.UserMapper;
import com.kanban.user.domain.model.Role;
import com.kanban.user.domain.model.User;
import com.kanban.user.domain.repository.UserRepository;
import com.kanban.user.application.CustomUserDetailsService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import lombok.Data;






@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> createAuthenticationToken(
            @Valid @RequestBody AuthenticationRequest authenticationRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(),
                        authenticationRequest.getPassword()));
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);
        
        // Get the user entity to convert to DTO
        User user = userRepository.findByUsername(authenticationRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserDTO userDTO = UserMapper.toDTO(user);
        
        return ResponseEntity.ok(new AuthResponseDTO(jwt, userDTO));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> registerUser(@Valid @RequestBody UserDTO userDTO) {
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(passwordEncoder().encode(userDTO.getPassword()));
        
        // Set displayName to username if not provided
        if (userDTO.getDisplayName() != null && !userDTO.getDisplayName().trim().isEmpty()) {
            user.setDisplayName(userDTO.getDisplayName());
        } else {
            user.setDisplayName(userDTO.getUsername());
        }
        
        user.setEmail(userDTO.getEmail());

        // Assign default role if needed
        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Default role not found"));
        user.setRoles(List.of(userRole));

        userRepository.save(user);
        
        // Generate JWT token for the newly registered user
        final UserDetails userDetails = userDetailsService.loadUserByUsername(userDTO.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);
        
        // Convert the saved user to DTO
        UserDTO savedUserDTO = UserMapper.toDTO(user);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponseDTO(jwt, savedUserDTO));
    }

    private PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Data
    static class AuthenticationRequest {
        @NotBlank(message = "Username is required")
        private String username;
        
        @NotBlank(message = "Password is required")
        private String password;
    }


}
