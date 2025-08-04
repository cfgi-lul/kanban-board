package Backend.Board.controller;

import Backend.Board.config.JwtUtil;
import Backend.Board.dto.UserRegisterDTO;
import Backend.Board.model.Role;
import Backend.Board.model.User;
import Backend.Board.repository.RoleRepository;
import Backend.Board.repository.UserRepository;
import Backend.Board.service.CustomUserDetailsService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import lombok.AllArgsConstructor;
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
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(),
                        authenticationRequest.getPassword()));
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);
        return ResponseEntity.ok(new AuthenticationResponse(jwt));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegisterDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            return ResponseEntity.badRequest().body("Username is already taken");
        }

        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(passwordEncoder().encode(userDTO.getPassword()));
        user.setName(userDTO.getName());

        // Assign default role if needed
        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Default role not found"));
        user.setRoles(List.of(userRole));

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    private PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Data
    static class AuthenticationRequest {
        private String username;
        private String password;
    }

    @Data
    @AllArgsConstructor
    static class AuthenticationResponse {
        private String token;
    }
}

class AuthenticationRequest {
    private String username;
    private String password;
    // getters and setters
}

class AuthenticationResponse {
    private String token;
    // constructor and getter
}
