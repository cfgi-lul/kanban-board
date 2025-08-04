package Backend.Board.mappers;

import Backend.Board.dto.UserDTO;
import Backend.Board.model.User;

public class UserMapper {
    public static UserDTO toDTO(User user) {
        if (user == null)
            return null;
        return new UserDTO(user.getId(), user.getUsername(), user.getName());
    }

    public static User toEntity(UserDTO userDTO) {
        if (userDTO == null)
            return null;
        User user = new User();
        user.setId(userDTO.getId());
        user.setUsername(userDTO.getUsername());
        user.setName(userDTO.getName());
        return user;
    }
}
