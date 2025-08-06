package com.kanban.shared.infrastructure.config;

import com.kanban.user.domain.repository.RoleRepository;
import com.kanban.user.domain.model.Role;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;



@Component
public class DataInitializer {
    private final RoleRepository roleRepository;

    public DataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @PostConstruct
    public void init() {
        createRoleIfNotFound("USER");
        createRoleIfNotFound("ADMIN");
    }

    private void createRoleIfNotFound(String name) {
        if (!roleRepository.existsByName(name)) {
            Role role = new Role();
            role.setName(name);
            roleRepository.save(role);
        }
    }
}
