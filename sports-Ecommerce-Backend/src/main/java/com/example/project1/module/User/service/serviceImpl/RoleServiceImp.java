package com.example.project1.module.User.service.serviceImpl;

import com.example.project1.mapper.RoleMapper;
import com.example.project1.model.dto.RoleDto;
import com.example.project1.model.dto.request.RoleRequest;
import com.example.project1.model.enity.Permission;
import com.example.project1.model.enity.Role;
import com.example.project1.module.User.repository.PermissionRepository;
import com.example.project1.module.User.repository.RoleRepository;
import com.example.project1.module.User.service.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleServiceImp implements RoleService {

    RoleRepository roleRepository;
    RoleMapper roleMapper;
    PermissionRepository permissionRepository;

    @Override
    public RoleDto create(RoleRequest request) {
        Role role = roleMapper.toEntity(request);

        List<Permission> permissions = permissionRepository.findAllById(request.getPermissions());
        role.setPermissions(new HashSet<>(permissions));
        return roleMapper.toDto(roleRepository.save(role));
    }

    @Override
    public List<RoleDto> getAll() {
        return roleMapper.toDto(roleRepository.findAll());
    }

    @Override
    public void delete(String role) {
          roleRepository.deleteById(role);
    }
}
