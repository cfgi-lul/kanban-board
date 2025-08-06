package Backend.Board.mappers;

import Backend.Board.dto.RoleDTO;
import Backend.Board.dto.UserDTO;
import Backend.Board.model.Role;
import Backend.Board.model.User;

import java.util.List;
import java.util.stream.Collectors;

public class UserMapper {
    public static UserDTO toDTO(User user) {
        if (user == null)
            return null;
        
        List<RoleDTO> roleDTOs = null;
        if (user.getRoles() != null) {
            roleDTOs = user.getRoles().stream()
                    .map(RoleMapper::toDTO)
                    .collect(Collectors.toList());
        }
        
        return new UserDTO(
            user.getId(),
            user.getUsername(),
            user.getDisplayName(),
            user.getEmail(),
            user.getAvatar(),
            user.getLastLoginAt(),
            user.getCreatedAt(),
            user.getUpdatedAt(),
            user.isEnabled(),
            user.getName(),
            roleDTOs
        );
    }

    public static User toEntity(UserDTO userDTO) {
        if (userDTO == null)
            return null;
        
        User user = new User();
        user.setId(userDTO.getId());
        user.setUsername(userDTO.getUsername());
        user.setDisplayName(userDTO.getDisplayName());
        user.setEmail(userDTO.getEmail());
        user.setAvatar(userDTO.getAvatar());
        user.setLastLoginAt(userDTO.getLastLoginAt());
        user.setCreatedAt(userDTO.getCreatedAt());
        user.setUpdatedAt(userDTO.getUpdatedAt());
        user.setEnabled(userDTO.isEnabled());
        user.setName(userDTO.getName());
        
        if (userDTO.getRoles() != null) {
            List<Role> roles = userDTO.getRoles().stream()
                    .map(RoleMapper::toEntity)
                    .collect(Collectors.toList());
            user.setRoles(roles);
        }
        
        return user;
    }
}
