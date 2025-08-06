package com.kanban.user.interfaces.rest;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Role data transfer object for API communication")
public class RoleDTO {
    @Schema(description = "Unique identifier for the role", example = "1")
    private Long id;
    
    @Schema(description = "Name of the role", example = "ADMIN", required = true)
    private String name;
} 
