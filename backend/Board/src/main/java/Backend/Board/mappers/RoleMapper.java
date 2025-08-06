package Backend.Board.mappers;

import Backend.Board.dto.RoleDTO;
import Backend.Board.model.Role;

public class RoleMapper {
    public static RoleDTO toDTO(Role role) {
        if (role == null)
            return null;
        return new RoleDTO(role.getId(), role.getName());
    }

    public static Role toEntity(RoleDTO roleDTO) {
        if (roleDTO == null)
            return null;
        Role role = new Role();
        role.setId(roleDTO.getId());
        role.setName(roleDTO.getName());
        return role;
    }
} 