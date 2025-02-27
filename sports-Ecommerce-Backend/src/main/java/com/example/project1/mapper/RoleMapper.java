package com.example.project1.mapper;

import com.example.project1.model.dto.PermissionDto;
import com.example.project1.model.dto.RoleDto;
import com.example.project1.model.dto.request.PermissionRequest;
import com.example.project1.model.dto.request.RoleRequest;
import com.example.project1.model.enity.Permission;
import com.example.project1.model.enity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    @Mapping(target = "permissions", ignore = true)
    Role toEntity(RoleRequest Request);

    List<RoleDto> toDto(List<Role> roles);

    RoleDto toDto(Role role);
}
