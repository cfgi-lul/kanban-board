package com.kanban.user.application;

import com.kanban.user.domain.model.User;
import com.kanban.user.domain.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService userDetailsService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setPassword("password123");
        testUser.setDisplayName("Test User");
        testUser.setEmail("test@example.com");
        testUser.setEnabled(true);
    }

    @Test
    void testLoadUserByUsername_Success() {
        // Arrange
        String username = "testuser";
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));

        // Act
        UserDetails result = userDetailsService.loadUserByUsername(username);

        // Assert
        assertNotNull(result);
        assertEquals(username, result.getUsername());
        assertEquals("password123", result.getPassword());
        assertTrue(result.isEnabled());
        verify(userRepository, times(1)).findByUsername(username);
    }

    @Test
    void testLoadUserByUsername_UserNotFound() {
        // Arrange
        String username = "nonexistentuser";
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // Act & Assert
        UsernameNotFoundException exception = assertThrows(
            UsernameNotFoundException.class,
            () -> userDetailsService.loadUserByUsername(username)
        );

        assertEquals("User not found", exception.getMessage());
        verify(userRepository, times(1)).findByUsername(username);
    }

    @Test
    void testLoadUserByUsername_WithRoles() {
        // Arrange
        String username = "testuser";
        testUser.setRoles(java.util.Arrays.asList(
            createRole(1L, "USER"),
            createRole(2L, "ADMIN")
        ));
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));

        // Act
        UserDetails result = userDetailsService.loadUserByUsername(username);

        // Assert
        assertNotNull(result);
        assertEquals(username, result.getUsername());
        assertNotNull(result.getAuthorities());
        assertEquals(2, result.getAuthorities().size());
        assertTrue(result.getAuthorities().stream()
            .anyMatch(auth -> auth.getAuthority().equals("USER")));
        assertTrue(result.getAuthorities().stream()
            .anyMatch(auth -> auth.getAuthority().equals("ADMIN")));
    }

    @Test
    void testLoadUserByUsername_DisabledUser() {
        // Arrange
        String username = "testuser";
        testUser.setEnabled(false);
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));

        // Act
        UserDetails result = userDetailsService.loadUserByUsername(username);

        // Assert
        assertNotNull(result);
        assertEquals(username, result.getUsername());
        assertFalse(result.isEnabled());
    }

    @Test
    void testLoadUserByUsername_UserWithNullRoles() {
        // Arrange
        String username = "testuser";
        testUser.setRoles(null);
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));

        // Act
        UserDetails result = userDetailsService.loadUserByUsername(username);

        // Assert
        assertNotNull(result);
        assertEquals(username, result.getUsername());
        assertNotNull(result.getAuthorities());
        assertTrue(result.getAuthorities().isEmpty());
    }

    @Test
    void testLoadUserByUsername_EmptyUsername() {
        // Arrange
        String username = "";
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // Act & Assert
        UsernameNotFoundException exception = assertThrows(
            UsernameNotFoundException.class,
            () -> userDetailsService.loadUserByUsername(username)
        );

        assertEquals("User not found", exception.getMessage());
        verify(userRepository, times(1)).findByUsername(username);
    }

    @Test
    void testLoadUserByUsername_NullUsername() {
        // Arrange
        when(userRepository.findByUsername(null)).thenReturn(Optional.empty());

        // Act & Assert
        UsernameNotFoundException exception = assertThrows(
            UsernameNotFoundException.class,
            () -> userDetailsService.loadUserByUsername(null)
        );

        assertEquals("User not found", exception.getMessage());
        verify(userRepository, times(1)).findByUsername(null);
    }

    @Test
    void testLoadUserByUsername_UserWithAllFields() {
        // Arrange
        String username = "testuser";
        testUser.setAvatar("avatar.jpg");
        testUser.setLastLoginAt(java.time.LocalDateTime.now());
        testUser.setCreatedAt(java.time.LocalDateTime.now());
        testUser.setUpdatedAt(java.time.LocalDateTime.now());
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));

        // Act
        UserDetails result = userDetailsService.loadUserByUsername(username);

        // Assert
        assertNotNull(result);
        assertEquals(username, result.getUsername());
        assertEquals("password123", result.getPassword());
        assertTrue(result.isEnabled());
        assertTrue(result.isAccountNonExpired());
        assertTrue(result.isAccountNonLocked());
        assertTrue(result.isCredentialsNonExpired());
    }

    private com.kanban.user.domain.model.Role createRole(Long id, String name) {
        com.kanban.user.domain.model.Role role = new com.kanban.user.domain.model.Role();
        role.setId(id);
        role.setName(name);
        return role;
    }
} 