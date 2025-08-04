package Backend.Board;

import Backend.Board.dto.UserDTO;
import Backend.Board.mappers.UserMapper;
import Backend.Board.model.User;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class UserMapperTest {

    @Test
    public void testUserDTOMapping() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setName("Test User");

        UserDTO userDTO = UserMapper.toDTO(user);

        assertNotNull(userDTO);
        assertEquals(1L, userDTO.getId());
        assertEquals("testuser", userDTO.getUsername());
        assertEquals("Test User", userDTO.getName());
    }
}