package com.kanban.user.domain.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    private User user;
    private Role userRole;
    private Role adminRole;

    @BeforeEach
    void setUp() {
        user = new User();
        userRole = new Role();
        userRole.setId(1L);
        userRole.setName("USER");
        
        adminRole = new Role();
        adminRole.setId(2L);
        adminRole.setName("ADMIN");
    }

    @Test
    void testUserCreationWithBasicFields() {
        // Arrange & Act
        user.setId(1L);
        user.setUsername("testuser");
        user.setPassword("password123");
        user.setDisplayName("Test User");
        user.setEmail("test@example.com");
        user.setAvatar("avatar.jpg");
        user.setEnabled(true);

        // Assert
        assertEquals(1L, user.getId());
        assertEquals("testuser", user.getUsername());
        assertEquals("password123", user.getPassword());
        assertEquals("Test User", user.getDisplayName());
        assertEquals("test@example.com", user.getEmail());
        assertEquals("avatar.jpg", user.getAvatar());
        assertTrue(user.isEnabled());
    }

    @Test
    void testUserWithRoles() {
        // Arrange
        user.setId(1L);
        user.setUsername("testuser");
        user.setPassword("password123");
        user.setRoles(Arrays.asList(userRole, adminRole));

        // Act
        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();

        // Assert
        assertNotNull(authorities);
        assertEquals(2, authorities.size());
        assertTrue(authorities.stream()
                .anyMatch(auth -> auth.getAuthority().equals("USER")));
        assertTrue(authorities.stream()
                .anyMatch(auth -> auth.getAuthority().equals("ADMIN")));
    }

    @Test
    void testUserWithoutRoles() {
        // Arrange
        user.setId(1L);
        user.setUsername("testuser");
        user.setPassword("password123");
        user.setRoles(null);

        // Act
        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();

        // Assert
        assertNotNull(authorities);
        assertTrue(authorities.isEmpty());
    }

    @Test
    void testUserDetailsMethods() {
        // Arrange
        user.setId(1L);
        user.setUsername("testuser");
        user.setPassword("password123");
        user.setEnabled(true);

        // Act & Assert
        assertTrue(user.isAccountNonExpired());
        assertTrue(user.isAccountNonLocked());
        assertTrue(user.isCredentialsNonExpired());
        assertTrue(user.isEnabled());

        // Test disabled user
        user.setEnabled(false);
        assertFalse(user.isEnabled());
    }

    @Test
    void testUserWithLastLoginTracking() {
        // Arrange
        LocalDateTime lastLogin = LocalDateTime.now();
        user.setId(1L);
        user.setUsername("testuser");
        user.setLastLoginAt(lastLogin);

        // Act & Assert
        assertEquals(lastLogin, user.getLastLoginAt());
    }

    @Test
    void testUserAuditFields() {
        // Arrange
        LocalDateTime now = LocalDateTime.now();
        user.setId(1L);
        user.setUsername("testuser");
        user.setCreatedAt(now);
        user.setUpdatedAt(now);

        // Act & Assert
        assertEquals(now, user.getCreatedAt());
        assertEquals(now, user.getUpdatedAt());
    }

    @Test
    void testUserWithLegacyNameField() {
        // Arrange
        user.setId(1L);
        user.setUsername("testuser");
        user.setName("Legacy Name"); // Deprecated field

        // Act & Assert
        assertEquals("Legacy Name", user.getName());
    }

    @Test
    void testUserEquality() {
        // Arrange
        User user1 = new User();
        user1.setId(1L);
        user1.setUsername("testuser");

        User user2 = new User();
        user2.setId(1L);
        user2.setUsername("testuser");

        User user3 = new User();
        user3.setId(2L);
        user3.setUsername("differentuser");

        // Act & Assert
        assertEquals(user1, user2);
        assertNotEquals(user1, user3);
    }

    @Test
    void testUserToString() {
        // Arrange
        user.setId(1L);
        user.setUsername("testuser");
        user.setDisplayName("Test User");

        // Act
        String userString = user.toString();

        // Assert
        assertNotNull(userString);
        assertTrue(userString.contains("testuser"));
    }

    @Test
    void testUserHashCode() {
        // Arrange
        User user1 = new User();
        user1.setId(1L);
        user1.setUsername("testuser");

        User user2 = new User();
        user2.setId(1L);
        user2.setUsername("testuser");

        // Act & Assert
        assertEquals(user1.hashCode(), user2.hashCode());
    }

    @Test
    void testUserWithEmptyRoles() {
        // Arrange
        user.setId(1L);
        user.setUsername("testuser");
        user.setRoles(Arrays.asList());

        // Act
        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();

        // Assert
        assertNotNull(authorities);
        assertTrue(authorities.isEmpty());
    }

    @Test
    void testUserWithNullDisplayName() {
        // Arrange
        user.setId(1L);
        user.setUsername("testuser");
        user.setDisplayName(null);

        // Act & Assert
        assertNull(user.getDisplayName());
    }

    @Test
    void testUserWithNullEmail() {
        // Arrange
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail(null);

        // Act & Assert
        assertNull(user.getEmail());
    }

    @Test
    void testUserWithNullAvatar() {
        // Arrange
        user.setId(1L);
        user.setUsername("testuser");
        user.setAvatar(null);

        // Act & Assert
        assertNull(user.getAvatar());
    }

    @Test
    void testUserDefaultEnabledValue() {
        // Arrange
        User newUser = new User();

        // Act & Assert
        assertTrue(newUser.isEnabled()); // Default value should be true
    }
} 