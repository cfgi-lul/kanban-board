package com.kanban.user.domain.repository;

import com.kanban.user.domain.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    private User testUser1;
    private User testUser2;

    @BeforeEach
    void setUp() {
        // Create test users
        testUser1 = new User();
        testUser1.setUsername("testuser1");
        testUser1.setPassword("password123");
        testUser1.setDisplayName("Test User 1");
        testUser1.setEmail("test1@example.com");
        testUser1.setEnabled(true);
        testUser1.setCreatedAt(LocalDateTime.now());
        testUser1.setUpdatedAt(LocalDateTime.now());

        testUser2 = new User();
        testUser2.setUsername("testuser2");
        testUser2.setPassword("password456");
        testUser2.setDisplayName("Test User 2");
        testUser2.setEmail("test2@example.com");
        testUser2.setEnabled(true);
        testUser2.setCreatedAt(LocalDateTime.now());
        testUser2.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void testSaveUser() {
        // Act
        User savedUser = userRepository.save(testUser1);

        // Assert
        assertNotNull(savedUser);
        assertNotNull(savedUser.getId());
        assertEquals("testuser1", savedUser.getUsername());
        assertEquals("password123", savedUser.getPassword());
        assertEquals("Test User 1", savedUser.getDisplayName());
        assertEquals("test1@example.com", savedUser.getEmail());
        assertTrue(savedUser.isEnabled());
    }

    @Test
    void testFindByUsername_UserExists() {
        // Arrange
        User savedUser = entityManager.persistAndFlush(testUser1);

        // Act
        Optional<User> foundUser = userRepository.findByUsername("testuser1");

        // Assert
        assertTrue(foundUser.isPresent());
        assertEquals(savedUser.getId(), foundUser.get().getId());
        assertEquals("testuser1", foundUser.get().getUsername());
    }

    @Test
    void testFindByUsername_UserNotExists() {
        // Act
        Optional<User> foundUser = userRepository.findByUsername("nonexistentuser");

        // Assert
        assertFalse(foundUser.isPresent());
    }

    @Test
    void testFindByUsername_EmptyUsername() {
        // Act
        Optional<User> foundUser = userRepository.findByUsername("");

        // Assert
        assertFalse(foundUser.isPresent());
    }

    @Test
    void testExistsByUsername_UserExists() {
        // Arrange
        entityManager.persistAndFlush(testUser1);

        // Act
        boolean exists = userRepository.existsByUsername("testuser1");

        // Assert
        assertTrue(exists);
    }

    @Test
    void testExistsByUsername_UserNotExists() {
        // Act
        boolean exists = userRepository.existsByUsername("nonexistentuser");

        // Assert
        assertFalse(exists);
    }

    @Test
    void testFindAll() {
        // Arrange
        entityManager.persistAndFlush(testUser1);
        entityManager.persistAndFlush(testUser2);

        // Act
        List<User> allUsers = userRepository.findAll();

        // Assert
        assertNotNull(allUsers);
        assertTrue(allUsers.size() >= 2);
        assertTrue(allUsers.stream().anyMatch(user -> "testuser1".equals(user.getUsername())));
        assertTrue(allUsers.stream().anyMatch(user -> "testuser2".equals(user.getUsername())));
    }

    @Test
    void testFindById_UserExists() {
        // Arrange
        User savedUser = entityManager.persistAndFlush(testUser1);

        // Act
        Optional<User> foundUser = userRepository.findById(savedUser.getId());

        // Assert
        assertTrue(foundUser.isPresent());
        assertEquals(savedUser.getId(), foundUser.get().getId());
        assertEquals("testuser1", foundUser.get().getUsername());
    }

    @Test
    void testFindById_UserNotExists() {
        // Act
        Optional<User> foundUser = userRepository.findById(999L);

        // Assert
        assertFalse(foundUser.isPresent());
    }

    @Test
    void testSaveUserWithAllFields() {
        // Arrange
        testUser1.setAvatar("avatar.jpg");
        testUser1.setLastLoginAt(LocalDateTime.now());

        // Act
        User savedUser = userRepository.save(testUser1);

        // Assert
        assertNotNull(savedUser);
        assertNotNull(savedUser.getId());
        assertEquals("testuser1", savedUser.getUsername());
        assertEquals("avatar.jpg", savedUser.getAvatar());
        assertNotNull(savedUser.getLastLoginAt());
        assertNotNull(savedUser.getCreatedAt());
        assertNotNull(savedUser.getUpdatedAt());
    }

    @Test
    void testUpdateUser() {
        // Arrange
        User savedUser = entityManager.persistAndFlush(testUser1);
        savedUser.setDisplayName("Updated User");
        savedUser.setEmail("updated@example.com");

        // Act
        User updatedUser = userRepository.save(savedUser);

        // Assert
        assertEquals("Updated User", updatedUser.getDisplayName());
        assertEquals("updated@example.com", updatedUser.getEmail());
        assertEquals(savedUser.getId(), updatedUser.getId());
    }

    @Test
    void testDeleteUser() {
        // Arrange
        User savedUser = entityManager.persistAndFlush(testUser1);

        // Act
        userRepository.delete(savedUser);
        entityManager.flush();

        // Assert
        Optional<User> deletedUser = userRepository.findById(savedUser.getId());
        assertFalse(deletedUser.isPresent());
    }

    @Test
    void testUserWithRoles() {
        // Arrange
        com.kanban.user.domain.model.Role userRole = new com.kanban.user.domain.model.Role();
        userRole.setName("USER");
        entityManager.persistAndFlush(userRole);

        testUser1.setRoles(java.util.Arrays.asList(userRole));
        User savedUser = entityManager.persistAndFlush(testUser1);

        // Act
        Optional<User> foundUser = userRepository.findById(savedUser.getId());

        // Assert
        assertTrue(foundUser.isPresent());
        assertNotNull(foundUser.get().getRoles());
        assertEquals(1, foundUser.get().getRoles().size());
        assertEquals("USER", foundUser.get().getRoles().get(0).getName());
    }

    @Test
    void testUserAuditFields() {
        // Arrange
        LocalDateTime beforeSave = LocalDateTime.now();
        testUser1.setCreatedAt(null);
        testUser1.setUpdatedAt(null);

        // Act
        User savedUser = userRepository.save(testUser1);
        LocalDateTime afterSave = LocalDateTime.now();

        // Assert
        assertNotNull(savedUser.getCreatedAt());
        assertNotNull(savedUser.getUpdatedAt());
        assertTrue(savedUser.getCreatedAt().isAfter(beforeSave) || savedUser.getCreatedAt().isEqual(beforeSave));
        assertTrue(savedUser.getUpdatedAt().isAfter(beforeSave) || savedUser.getUpdatedAt().isEqual(beforeSave));
    }

    @Test
    void testUserWithDisabledStatus() {
        // Arrange
        testUser1.setEnabled(false);

        // Act
        User savedUser = userRepository.save(testUser1);

        // Assert
        assertFalse(savedUser.isEnabled());
    }

    @Test
    void testUniqueUsernameConstraint() {
        // Arrange
        User user1 = new User();
        user1.setUsername("duplicateuser");
        user1.setPassword("password123");
        user1.setDisplayName("User 1");
        user1.setEmail("user1@example.com");

        User user2 = new User();
        user2.setUsername("duplicateuser"); // Same username
        user2.setPassword("password456");
        user2.setDisplayName("User 2");
        user2.setEmail("user2@example.com");

        // Act & Assert
        User savedUser1 = userRepository.save(user1);
        assertNotNull(savedUser1);

        // This should throw an exception due to unique constraint
        assertThrows(Exception.class, () -> {
            userRepository.save(user2);
            entityManager.flush();
        });
    }

    @Test
    void testUserWithNullFields() {
        // Arrange
        testUser1.setDisplayName(null);
        testUser1.setEmail(null);
        testUser1.setAvatar(null);

        // Act
        User savedUser = userRepository.save(testUser1);

        // Assert
        assertNotNull(savedUser);
        assertNull(savedUser.getDisplayName());
        assertNull(savedUser.getEmail());
        assertNull(savedUser.getAvatar());
    }
} 