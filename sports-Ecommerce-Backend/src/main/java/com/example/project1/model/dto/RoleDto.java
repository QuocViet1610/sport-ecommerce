package com.example.project1.model.dto;

import com.example.project1.model.enity.Permission;
import lombok.Data;

import java.util.Set;

@Data
public class RoleDto {
    String name;
    String description;
    Set<Permission> permissions;
}
