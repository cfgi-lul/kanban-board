package Backend.Board;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

import Backend.Board.dto.UserRegisterDTO;

public class testUserRegisterDTO {

    @Test
    public void userRegisterDTOTest() {
        UserRegisterDTO dto = new UserRegisterDTO();
        dto.setUsername("testuser");
        dto.setPassword("password123");
        dto.setName("Test User");

        assertEquals("testuser", dto.getUsername());
        assertEquals("password123", dto.getPassword());
        assertEquals("Test User", dto.getName());
    }
}