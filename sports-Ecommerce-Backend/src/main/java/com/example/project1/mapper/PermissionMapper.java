package com.example.project1.mapper;

import com.example.project1.model.dto.PermissionDto;
import com.example.project1.model.dto.UserDto;
import com.example.project1.model.dto.request.PermissionRequest;
import com.example.project1.model.dto.request.UserCreateRequest;
import com.example.project1.model.enity.Permission;
import com.example.project1.model.enity.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PermissionMapper {

    Permission toEntity(PermissionRequest Request);

    List<PermissionDto> toDtos(List<Permission> permissions);

    PermissionDto toDto(Permission permission);
}
