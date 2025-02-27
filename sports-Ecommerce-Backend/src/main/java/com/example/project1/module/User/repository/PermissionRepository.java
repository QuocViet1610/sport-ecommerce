package com.example.project1.module.User.repository;

import com.example.project1.model.enity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface PermissionRepository extends JpaRepository<Permission,String> {

}
