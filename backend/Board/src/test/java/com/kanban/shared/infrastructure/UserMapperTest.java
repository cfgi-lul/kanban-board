package com.kanban.shared.infrastructure;

import org.junit.jupiter.api.Test;

import com.kanban.shared.infrastructure.UserMapper;
import com.kanban.user.domain.model.User;
import com.kanban.user.interfaces.rest.UserDTO;

import static org.junit.jupiter.api.Assertions.*;

public class UserMapperTest {

    @Test
    public void testUserDTOMapping() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setDisplayName("Test User");

        UserDTO userDTO = UserMapper.toDTO(user);

        assertNotNull(userDTO);
        assertEquals(1L, userDTO.getId());
        assertEquals("testuser", userDTO.getUsername());
        assertEquals("Test User", userDTO.getDisplayName());
    }
} 