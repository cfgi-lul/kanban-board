package com.kanban.user.infrastructure;

import com.kanban.shared.infrastructure.UserMapper;
import com.kanban.user.domain.model.Role;
import com.kanban.user.domain.model.User;
import com.kanban.user.interfaces.rest.UserDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class UserMapperTest {

    private User testUser;
    private UserDTO testUserDTO;
    private Role userRole;
    private Role adminRole;

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
    }

    @Test
    void testToDTO_WithAllFields() {
        // Arrange
        testUser.setRoles(Arrays.asList(userRole, adminRole));

        // Act
        UserDTO result = UserMapper.toDTO(testUser);

        // Assert
        assertNotNull(result);
        assertEquals(testUser.getId(), result.getId());
        assertEquals(testUser.getDisplayName(), result.getDisplayName());
        assertEquals(testUser.getEmail(), result.getEmail());
        assertEquals(testUser.getAvatar(), result.getAvatar());
        assertNotNull(result.getRoles());
        assertEquals(2, result.getRoles().size());
        assertTrue(result.getRoles().stream().anyMatch(role -> "USER".equals(role.getName())));
        assertTrue(result.getRoles().stream().anyMatch(role -> "ADMIN".equals(role.getName())));
    }

    @Test
    void testToDTO_WithoutRoles() {
        // Arrange
        testUser.setRoles(null);

        // Act
        UserDTO result = UserMapper.toDTO(testUser);

        // Assert
        assertNotNull(result);
        assertEquals(testUser.getId(), result.getId());
        assertEquals(testUser.getDisplayName(), result.getDisplayName());
        assertEquals(testUser.getEmail(), result.getEmail());
        assertEquals(testUser.getAvatar(), result.getAvatar());
        assertNull(result.getRoles());
    }

    @Test
    void testToDTO_WithEmptyRoles() {
        // Arrange
        testUser.setRoles(Arrays.asList());

        // Act
        UserDTO result = UserMapper.toDTO(testUser);

        // Assert
        assertNotNull(result);
        assertEquals(testUser.getId(), result.getId());
        assertEquals(testUser.getDisplayName(), result.getDisplayName());
        assertEquals(testUser.getEmail(), result.getEmail());
        assertEquals(testUser.getAvatar(), result.getAvatar());
        assertNotNull(result.getRoles());
        assertTrue(result.getRoles().isEmpty());
    }

    @Test
    void testToDTO_WithNullFields() {
        // Arrange
        testUser.setDisplayName(null);
        testUser.setEmail(null);
        testUser.setAvatar(null);
        testUser.setRoles(null);

        // Act
        UserDTO result = UserMapper.toDTO(testUser);

        // Assert
        assertNotNull(result);
        assertEquals(testUser.getId(), result.getId());
        assertNull(result.getDisplayName());
        assertNull(result.getEmail());
        assertNull(result.getAvatar());
        assertNull(result.getRoles());
    }

    @Test
    void testToDTO_WithNullUser() {
        // Act
        UserDTO result = UserMapper.toDTO(null);

        // Assert
        assertNull(result);
    }

    @Test
    void testToDTO_WithUserWithoutId() {
        // Arrange
        testUser.setId(null);

        // Act
        UserDTO result = UserMapper.toDTO(testUser);

        // Assert
        assertNotNull(result);
        assertNull(result.getId());
        assertEquals(testUser.getDisplayName(), result.getDisplayName());
        assertEquals(testUser.getEmail(), result.getEmail());
        assertEquals(testUser.getAvatar(), result.getAvatar());
    }

    @Test
    void testToDTO_WithSpecialCharacters() {
        // Arrange
        testUser.setDisplayName("Test User with émojî");
        testUser.setEmail("test@domain.com");
        testUser.setAvatar("avatar-émojî.jpg");

        // Act
        UserDTO result = UserMapper.toDTO(testUser);

        // Assert
        assertNotNull(result);
        assertEquals("Test User with émojî", result.getDisplayName());
        assertEquals("test@domain.com", result.getEmail());
        assertEquals("avatar-émojî.jpg", result.getAvatar());
    }

    @Test
    void testToDTO_WithLongValues() {
        // Arrange
        String longDisplayName = "a".repeat(1000);
        String longEmail = "a".repeat(500) + "@domain.com";
        String longAvatar = "a".repeat(500) + ".jpg";
        
        testUser.setDisplayName(longDisplayName);
        testUser.setEmail(longEmail);
        testUser.setAvatar(longAvatar);

        // Act
        UserDTO result = UserMapper.toDTO(testUser);

        // Assert
        assertNotNull(result);
        assertEquals(longDisplayName, result.getDisplayName());
        assertEquals(longEmail, result.getEmail());
        assertEquals(longAvatar, result.getAvatar());
    }

    @Test
    void testToDTO_WithWhitespace() {
        // Arrange
        testUser.setDisplayName("  Test User  ");
        testUser.setEmail("  test@domain.com  ");
        testUser.setAvatar("  avatar.jpg  ");

        // Act
        UserDTO result = UserMapper.toDTO(testUser);

        // Assert
        assertNotNull(result);
        assertEquals("  Test User  ", result.getDisplayName());
        assertEquals("  test@domain.com  ", result.getEmail());
        assertEquals("  avatar.jpg  ", result.getAvatar());
    }

    @Test
    void testToDTO_WithRoleWithoutId() {
        // Arrange
        userRole.setId(null);
        testUser.setRoles(Arrays.asList(userRole));

        // Act
        UserDTO result = UserMapper.toDTO(testUser);

        // Assert
        assertNotNull(result);
        assertNotNull(result.getRoles());
        assertEquals(1, result.getRoles().size());
        assertNull(result.getRoles().get(0).getId());
        assertEquals("USER", result.getRoles().get(0).getName());
    }

    @Test
    void testToDTO_WithRoleWithoutName() {
        // Arrange
        userRole.setName(null);
        testUser.setRoles(Arrays.asList(userRole));

        // Act
        UserDTO result = UserMapper.toDTO(testUser);

        // Assert
        assertNotNull(result);
        assertNotNull(result.getRoles());
        assertEquals(1, result.getRoles().size());
        assertNull(result.getRoles().get(0).getName());
    }

    @Test
    void testToDTO_WithMultipleRoles() {
        // Arrange
        Role moderatorRole = new Role();
        moderatorRole.setId(3L);
        moderatorRole.setName("MODERATOR");
        
        testUser.setRoles(Arrays.asList(userRole, adminRole, moderatorRole));

        // Act
        UserDTO result = UserMapper.toDTO(testUser);

        // Assert
        assertNotNull(result);
        assertNotNull(result.getRoles());
        assertEquals(3, result.getRoles().size());
        assertTrue(result.getRoles().stream().anyMatch(role -> "USER".equals(role.getName())));
        assertTrue(result.getRoles().stream().anyMatch(role -> "ADMIN".equals(role.getName())));
        assertTrue(result.getRoles().stream().anyMatch(role -> "MODERATOR".equals(role.getName())));
    }

    @Test
    void testToDTO_WithRoleWithSpecialCharacters() {
        // Arrange
        userRole.setName("USER_ROLE_émojî");
        testUser.setRoles(Arrays.asList(userRole));

        // Act
        UserDTO result = UserMapper.toDTO(testUser);

        // Assert
        assertNotNull(result);
        assertNotNull(result.getRoles());
        assertEquals(1, result.getRoles().size());
        assertEquals("USER_ROLE_émojî", result.getRoles().get(0).getName());
    }

    @Test
    void testToDTO_WithRoleWithSpaces() {
        // Arrange
        userRole.setName("USER ROLE");
        testUser.setRoles(Arrays.asList(userRole));

        // Act
        UserDTO result = UserMapper.toDTO(testUser);

        // Assert
        assertNotNull(result);
        assertNotNull(result.getRoles());
        assertEquals(1, result.getRoles().size());
        assertEquals("USER ROLE", result.getRoles().get(0).getName());
    }

    @Test
    void testToDTO_WithRoleWithLongName() {
        // Arrange
        String longRoleName = "a".repeat(100);
        userRole.setName(longRoleName);
        testUser.setRoles(Arrays.asList(userRole));

        // Act
        UserDTO result = UserMapper.toDTO(testUser);

        // Assert
        assertNotNull(result);
        assertNotNull(result.getRoles());
        assertEquals(1, result.getRoles().size());
        assertEquals(longRoleName, result.getRoles().get(0).getName());
    }
} 