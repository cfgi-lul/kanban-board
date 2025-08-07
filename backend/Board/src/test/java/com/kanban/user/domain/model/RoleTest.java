package com.kanban.user.domain.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

import static org.junit.jupiter.api.Assertions.*;

class RoleTest {

    private Role role;

    @BeforeEach
    void setUp() {
        role = new Role();
    }

    @Test
    void testRoleCreationWithBasicFields() {
        // Arrange & Act
        role.setId(1L);
        role.setName("USER");

        // Assert
        assertEquals(1L, role.getId());
        assertEquals("USER", role.getName());
    }

    @Test
    void testRoleAsGrantedAuthority() {
        // Arrange
        role.setId(1L);
        role.setName("ADMIN");

        // Act
        GrantedAuthority authority = role;

        // Assert
        assertNotNull(authority);
        assertEquals("ADMIN", authority.getAuthority());
    }

    @Test
    void testRoleEquality() {
        // Arrange
        Role role1 = new Role();
        role1.setId(1L);
        role1.setName("USER");

        Role role2 = new Role();
        role2.setId(1L);
        role2.setName("USER");

        Role role3 = new Role();
        role3.setId(2L);
        role3.setName("ADMIN");

        // Act & Assert
        assertEquals(role1, role2);
        assertNotEquals(role1, role3);
    }

    @Test
    void testRoleToString() {
        // Arrange
        role.setId(1L);
        role.setName("USER");

        // Act
        String roleString = role.toString();

        // Assert
        assertNotNull(roleString);
        assertTrue(roleString.contains("USER"));
    }

    @Test
    void testRoleHashCode() {
        // Arrange
        Role role1 = new Role();
        role1.setId(1L);
        role1.setName("USER");

        Role role2 = new Role();
        role2.setId(1L);
        role2.setName("USER");

        // Act & Assert
        assertEquals(role1.hashCode(), role2.hashCode());
    }

    @Test
    void testRoleWithNullName() {
        // Arrange
        role.setId(1L);
        role.setName(null);

        // Act & Assert
        assertNull(role.getName());
        assertNull(role.getAuthority());
    }

    @Test
    void testRoleWithEmptyName() {
        // Arrange
        role.setId(1L);
        role.setName("");

        // Act & Assert
        assertEquals("", role.getName());
        assertEquals("", role.getAuthority());
    }

    @Test
    void testRoleWithSpecialCharacters() {
        // Arrange
        role.setId(1L);
        role.setName("ROLE_ADMIN");

        // Act & Assert
        assertEquals("ROLE_ADMIN", role.getName());
        assertEquals("ROLE_ADMIN", role.getAuthority());
    }

    @Test
    void testRoleDefaultConstructor() {
        // Arrange
        Role newRole = new Role();

        // Act & Assert
        assertNotNull(newRole);
        assertNull(newRole.getId());
        assertNull(newRole.getName());
    }

    @Test
    void testRoleAllArgsConstructor() {
        // Arrange & Act
        Role role = new Role(1L, "USER");

        // Assert
        assertEquals(1L, role.getId());
        assertEquals("USER", role.getName());
    }
} 