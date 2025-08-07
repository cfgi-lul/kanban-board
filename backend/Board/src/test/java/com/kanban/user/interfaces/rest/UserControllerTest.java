package com.kanban.user.interfaces.rest;

import com.kanban.shared.infrastructure.UserMapper;
import com.kanban.user.domain.model.Role;
import com.kanban.user.domain.model.User;
import com.kanban.user.domain.repository.RoleRepository;
import com.kanban.user.domain.repository.UserRepository;
import com.kanban.user.interfaces.rest.UserDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Import(TestSecurityConfig.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private RoleRepository roleRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;
    private UserDTO testUserDTO;
    private Role userRole;
    private Role adminRole;
    private UserDetails userDetails;

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

        // Create test user DTO
        testUserDTO = new UserDTO();
        testUserDTO.setId(1L);
        testUserDTO.setDisplayName("Test User");
        testUserDTO.setEmail("test@example.com");
        testUserDTO.setAvatar("avatar.jpg");

        // Create test roles
        userRole = new Role();
        userRole.setId(1L);
        userRole.setName("USER");

        adminRole = new Role();
        adminRole.setId(2L);
        adminRole.setName("ADMIN");

        testUser.setRoles(Arrays.asList(userRole));

        // Create UserDetails for authentication
        userDetails = org.springframework.security.core.userdetails.User
                .withUsername("testuser")
                .password("password123")
                .authorities("USER")
                .build();

        // Set up authentication context
        UsernamePasswordAuthenticationToken authentication = 
            new UsernamePasswordAuthenticationToken(
                userDetails, 
                null, 
                Collections.singletonList(new SimpleGrantedAuthority("USER"))
            );
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @Test
    void testGetAllUsers_Success() throws Exception {
        // Arrange
        when(userRepository.findAll()).thenReturn(Arrays.asList(testUser));

        // Act & Assert
        mockMvc.perform(get("/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].displayName").value("Test User"))
                .andExpect(jsonPath("$[0].email").value("test@example.com"));

        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testGetAllUsers_WithSpecificId() throws Exception {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act & Assert
        mockMvc.perform(get("/users").param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].displayName").value("Test User"));

        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void testGetAllUsers_UserNotFound() throws Exception {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(get("/users").param("id", "999"))
                .andExpect(status().is5xxServerError());

        verify(userRepository, times(1)).findById(999L);
    }

    @Test
    void testCreateUser_Success() throws Exception {
        // Arrange
        UserDTO newUserDTO = new UserDTO();
        newUserDTO.setUsername("newuser");
        newUserDTO.setPassword("password123");
        newUserDTO.setDisplayName("New User");
        newUserDTO.setEmail("newuser@example.com");
        newUserDTO.setEnabled(true);

        User newUser = new User();
        newUser.setId(2L);
        newUser.setUsername("newuser");
        newUser.setPassword("password123");
        newUser.setDisplayName("New User");
        newUser.setEmail("newuser@example.com");
        newUser.setEnabled(true);

        when(userRepository.save(any(User.class))).thenReturn(newUser);
        when(roleRepository.findByName("USER")).thenReturn(Optional.of(userRole));

        // Act & Assert
        mockMvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newUserDTO)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.displayName").value("New User"))
                .andExpect(jsonPath("$.email").value("newuser@example.com"));

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testCreateUser_InvalidData() throws Exception {
        // Arrange
        UserDTO invalidUserDTO = new UserDTO();
        invalidUserDTO.setUsername("");
        invalidUserDTO.setPassword("password123");
        invalidUserDTO.setDisplayName("New User");
        invalidUserDTO.setEnabled(true);

        User invalidUser = new User();
        invalidUser.setId(2L);
        invalidUser.setUsername("");
        invalidUser.setPassword("password123");
        invalidUser.setDisplayName("New User");
        invalidUser.setEnabled(true);

        when(userRepository.save(any(User.class))).thenReturn(invalidUser);

        // Act & Assert
        mockMvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidUserDTO)))
                .andExpect(status().isOk());

        verify(userRepository, times(1)).save(any(User.class));
    }
} 