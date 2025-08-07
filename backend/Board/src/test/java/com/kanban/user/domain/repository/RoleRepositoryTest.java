package com.kanban.user.domain.repository;

import com.kanban.user.domain.model.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class RoleRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private RoleRepository roleRepository;

    private Role userRole;
    private Role adminRole;

    @BeforeEach
    void setUp() {
        // Create test roles
        userRole = new Role();
        userRole.setName("USER");

        adminRole = new Role();
        adminRole.setName("ADMIN");
    }

    @Test
    void testSaveRole() {
        // Act
        Role savedRole = roleRepository.save(userRole);

        // Assert
        assertNotNull(savedRole);
        assertNotNull(savedRole.getId());
        assertEquals("USER", savedRole.getName());
    }

    @Test
    void testFindByName_RoleExists() {
        // Arrange
        Role savedRole = entityManager.persistAndFlush(userRole);

        // Act
        Optional<Role> foundRole = roleRepository.findByName("USER");

        // Assert
        assertTrue(foundRole.isPresent());
        assertEquals(savedRole.getId(), foundRole.get().getId());
        assertEquals("USER", foundRole.get().getName());
    }

    @Test
    void testFindByName_RoleNotExists() {
        // Act
        Optional<Role> foundRole = roleRepository.findByName("NONEXISTENT");

        // Assert
        assertFalse(foundRole.isPresent());
    }

    @Test
    void testFindByName_EmptyName() {
        // Act
        Optional<Role> foundRole = roleRepository.findByName("");

        // Assert
        assertFalse(foundRole.isPresent());
    }

    @Test
    void testExistsByName_RoleExists() {
        // Arrange
        entityManager.persistAndFlush(userRole);

        // Act
        boolean exists = roleRepository.existsByName("USER");

        // Assert
        assertTrue(exists);
    }

    @Test
    void testExistsByName_RoleNotExists() {
        // Act
        boolean exists = roleRepository.existsByName("NONEXISTENT");

        // Assert
        assertFalse(exists);
    }

    @Test
    void testFindAll() {
        // Arrange
        entityManager.persistAndFlush(userRole);
        entityManager.persistAndFlush(adminRole);

        // Act
        List<Role> allRoles = roleRepository.findAll();

        // Assert
        assertNotNull(allRoles);
        assertTrue(allRoles.size() >= 2);
        assertTrue(allRoles.stream().anyMatch(role -> "USER".equals(role.getName())));
        assertTrue(allRoles.stream().anyMatch(role -> "ADMIN".equals(role.getName())));
    }

    @Test
    void testFindById_RoleExists() {
        // Arrange
        Role savedRole = entityManager.persistAndFlush(userRole);

        // Act
        Optional<Role> foundRole = roleRepository.findById(savedRole.getId());

        // Assert
        assertTrue(foundRole.isPresent());
        assertEquals(savedRole.getId(), foundRole.get().getId());
        assertEquals("USER", foundRole.get().getName());
    }

    @Test
    void testFindById_RoleNotExists() {
        // Act
        Optional<Role> foundRole = roleRepository.findById(999L);

        // Assert
        assertFalse(foundRole.isPresent());
    }

    @Test
    void testUpdateRole() {
        // Arrange
        Role savedRole = entityManager.persistAndFlush(userRole);
        savedRole.setName("UPDATED_USER");

        // Act
        Role updatedRole = roleRepository.save(savedRole);

        // Assert
        assertEquals("UPDATED_USER", updatedRole.getName());
        assertEquals(savedRole.getId(), updatedRole.getId());
    }

    @Test
    void testDeleteRole() {
        // Arrange
        Role savedRole = entityManager.persistAndFlush(userRole);

        // Act
        roleRepository.delete(savedRole);
        entityManager.flush();

        // Assert
        Optional<Role> deletedRole = roleRepository.findById(savedRole.getId());
        assertFalse(deletedRole.isPresent());
    }

    @Test
    void testRoleAuthority() {
        // Arrange
        Role savedRole = entityManager.persistAndFlush(userRole);

        // Act
        Optional<Role> foundRole = roleRepository.findById(savedRole.getId());

        // Assert
        assertTrue(foundRole.isPresent());
        assertEquals("USER", foundRole.get().getAuthority());
    }

    @Test
    void testUniqueRoleNameConstraint() {
        // Arrange
        Role role1 = new Role();
        role1.setName("DUPLICATE_ROLE");

        Role role2 = new Role();
        role2.setName("DUPLICATE_ROLE"); // Same name

        // Act & Assert
        Role savedRole1 = roleRepository.save(role1);
        assertNotNull(savedRole1);

        // Since there's no unique constraint on role names, this should succeed
        Role savedRole2 = roleRepository.save(role2);
        assertNotNull(savedRole2);
        assertEquals("DUPLICATE_ROLE", savedRole1.getName());
        assertEquals("DUPLICATE_ROLE", savedRole2.getName());
    }

    @Test
    void testRoleWithNullName() {
        // Arrange
        Role role = new Role();
        role.setName(null);

        // Act & Assert
        // Since there's no NOT NULL constraint, this should succeed
        Role savedRole = roleRepository.save(role);
        assertNotNull(savedRole);
        assertNull(savedRole.getName());
    }

    @Test
    void testRoleWithEmptyName() {
        // Arrange
        Role role = new Role();
        role.setName("");

        // Act
        Role savedRole = roleRepository.save(role);

        // Assert
        assertNotNull(savedRole);
        assertEquals("", savedRole.getName());
    }

    @Test
    void testRoleWithSpecialCharacters() {
        // Arrange
        Role role = new Role();
        role.setName("SPECIAL_ROLE_123");

        // Act
        Role savedRole = roleRepository.save(role);

        // Assert
        assertNotNull(savedRole);
        assertEquals("SPECIAL_ROLE_123", savedRole.getName());
    }

    @Test
    void testRoleWithLongName() {
        // Arrange
        Role role = new Role();
        role.setName("VERY_LONG_ROLE_NAME_THAT_MIGHT_EXCEED_DEFAULT_LENGTH");

        // Act
        Role savedRole = roleRepository.save(role);

        // Assert
        assertNotNull(savedRole);
        assertEquals("VERY_LONG_ROLE_NAME_THAT_MIGHT_EXCEED_DEFAULT_LENGTH", savedRole.getName());
    }

    @Test
    void testRoleCaseSensitivity() {
        // Arrange
        Role role1 = new Role();
        role1.setName("user");

        Role role2 = new Role();
        role2.setName("USER");

        // Act
        Role savedRole1 = roleRepository.save(role1);
        Role savedRole2 = roleRepository.save(role2);

        // Assert
        assertNotNull(savedRole1);
        assertNotNull(savedRole2);
        assertEquals("user", savedRole1.getName());
        assertEquals("USER", savedRole2.getName());
    }

    @Test
    void testRoleWithSpaces() {
        // Arrange
        Role role = new Role();
        role.setName("USER ROLE");

        // Act
        Role savedRole = roleRepository.save(role);

        // Assert
        assertNotNull(savedRole);
        assertEquals("USER ROLE", savedRole.getName());
    }
} 