package com.kanban.user.interfaces.rest;

import com.kanban.shared.infrastructure.UserMapper;
import com.kanban.shared.infrastructure.config.JwtUtil;
import com.kanban.user.application.CustomUserDetailsService;
import com.kanban.user.domain.model.Role;
import com.kanban.user.domain.model.User;
import com.kanban.user.domain.repository.RoleRepository;
import com.kanban.user.domain.repository.UserRepository;
import com.kanban.user.interfaces.rest.AuthResponseDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Import(TestSecurityConfig.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private RoleRepository roleRepository;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;
    private Role userRole;
    private UserDetails userDetails;
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        // Create test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setPassword("password123");
        testUser.setDisplayName("Test User");
        testUser.setEmail("test@example.com");
        testUser.setAvatar("avatar.jpg");
        testUser.setEnabled(true);
        testUser.setCreatedAt(LocalDateTime.now());
        testUser.setUpdatedAt(LocalDateTime.now());

        // Create test role
        userRole = new Role();
        userRole.setId(1L);
        userRole.setName("USER");

        testUser.setRoles(Arrays.asList(userRole));

        // Create UserDetails for authentication
        userDetails = org.springframework.security.core.userdetails.User
                .withUsername("testuser")
                .password("password123")
                .authorities("USER")
                .build();

        // Create Authentication object
        authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

    @Test
    void testLogin_Success() throws Exception {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(userDetailsService.loadUserByUsername("testuser")).thenReturn(userDetails);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(jwtUtil.generateToken(any(UserDetails.class))).thenReturn("mock-jwt-token");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testuser\",\"password\":\"password123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user").exists());

        verify(userRepository, times(1)).findByUsername("testuser");
        verify(userDetailsService, times(1)).loadUserByUsername("testuser");
        verify(jwtUtil, times(1)).generateToken(any(UserDetails.class));
    }

    @Test
    void testLogin_InvalidCredentials() throws Exception {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"invaliduser\",\"password\":\"wrongpassword\"}"))
                .andExpect(status().isUnauthorized());

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void testLogin_EmptyUsername() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"\",\"password\":\"password123\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLogin_EmptyPassword() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testuser\",\"password\":\"\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLogin_MissingUsername() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"password\":\"password123\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLogin_MissingPassword() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testuser\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLogin_DisabledUser() throws Exception {
        // Arrange
        testUser.setEnabled(false);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(userDetailsService.loadUserByUsername("testuser")).thenReturn(userDetails);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("User is disabled"));

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testuser\",\"password\":\"password123\"}"))
                .andExpect(status().isUnauthorized());

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void testLogin_UserWithRoles() throws Exception {
        // Arrange
        Role adminRole = new Role();
        adminRole.setId(2L);
        adminRole.setName("ADMIN");
        testUser.setRoles(Arrays.asList(userRole, adminRole));
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(userDetailsService.loadUserByUsername("testuser")).thenReturn(userDetails);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(jwtUtil.generateToken(any(UserDetails.class))).thenReturn("mock-jwt-token");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testuser\",\"password\":\"password123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user").exists());

        verify(userRepository, times(1)).findByUsername("testuser");
        verify(userDetailsService, times(1)).loadUserByUsername("testuser");
        verify(jwtUtil, times(1)).generateToken(any(UserDetails.class));
    }

    @Test
    void testLogin_UserWithoutRoles() throws Exception {
        // Arrange
        testUser.setRoles(null);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(userDetailsService.loadUserByUsername("testuser")).thenReturn(userDetails);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(jwtUtil.generateToken(any(UserDetails.class))).thenReturn("mock-jwt-token");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testuser\",\"password\":\"password123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user").exists());

        verify(userRepository, times(1)).findByUsername("testuser");
        verify(userDetailsService, times(1)).loadUserByUsername("testuser");
        verify(jwtUtil, times(1)).generateToken(any(UserDetails.class));
    }

    @Test
    void testLogin_InvalidJson() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("invalid json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLogin_NullRequest() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("null"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLogin_WithSpecialCharacters() throws Exception {
        // Arrange
        testUser.setUsername("user@domain.com");
        when(userRepository.findByUsername("user@domain.com")).thenReturn(Optional.of(testUser));
        when(userDetailsService.loadUserByUsername("user@domain.com")).thenReturn(userDetails);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(jwtUtil.generateToken(any(UserDetails.class))).thenReturn("mock-jwt-token");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"user@domain.com\",\"password\":\"password123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());

        verify(userRepository, times(1)).findByUsername("user@domain.com");
        verify(userDetailsService, times(1)).loadUserByUsername("user@domain.com");
        verify(jwtUtil, times(1)).generateToken(any(UserDetails.class));
    }

    @Test
    void testLogin_WithLongPassword() throws Exception {
        // Arrange
        String longPassword = "a".repeat(100);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(userDetailsService.loadUserByUsername("testuser")).thenReturn(userDetails);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(jwtUtil.generateToken(any(UserDetails.class))).thenReturn("mock-jwt-token");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testuser\",\"password\":\"" + longPassword + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());

        verify(userRepository, times(1)).findByUsername("testuser");
        verify(userDetailsService, times(1)).loadUserByUsername("testuser");
        verify(jwtUtil, times(1)).generateToken(any(UserDetails.class));
    }

    @Test
    void testLogin_WithUnicodeCharacters() throws Exception {
        // Arrange
        testUser.setUsername("usér");
        testUser.setPassword("pässwörd");
        when(userRepository.findByUsername("usér")).thenReturn(Optional.of(testUser));
        when(userDetailsService.loadUserByUsername("usér")).thenReturn(userDetails);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(jwtUtil.generateToken(any(UserDetails.class))).thenReturn("mock-jwt-token");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"usér\",\"password\":\"pässwörd\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());

        verify(userRepository, times(1)).findByUsername("usér");
        verify(userDetailsService, times(1)).loadUserByUsername("usér");
        verify(jwtUtil, times(1)).generateToken(any(UserDetails.class));
    }

    @Test
    void testLogin_WithWhitespace() throws Exception {
        // Arrange
        testUser.setUsername(" testuser ");
        when(userRepository.findByUsername(" testuser ")).thenReturn(Optional.of(testUser));
        when(userDetailsService.loadUserByUsername(" testuser ")).thenReturn(userDetails);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(jwtUtil.generateToken(any(UserDetails.class))).thenReturn("mock-jwt-token");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\" testuser \",\"password\":\"password123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());

        verify(userRepository, times(1)).findByUsername(" testuser ");
        verify(userDetailsService, times(1)).loadUserByUsername(" testuser ");
        verify(jwtUtil, times(1)).generateToken(any(UserDetails.class));
    }

    @Test
    void testLogin_WithNullValues() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":null,\"password\":null}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLogin_WithExtraFields() throws Exception {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(userDetailsService.loadUserByUsername("testuser")).thenReturn(userDetails);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(jwtUtil.generateToken(any(UserDetails.class))).thenReturn("mock-jwt-token");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"testuser\",\"password\":\"password123\",\"extraField\":\"value\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());

        verify(userRepository, times(1)).findByUsername("testuser");
        verify(userDetailsService, times(1)).loadUserByUsername("testuser");
        verify(jwtUtil, times(1)).generateToken(any(UserDetails.class));
    }
} 