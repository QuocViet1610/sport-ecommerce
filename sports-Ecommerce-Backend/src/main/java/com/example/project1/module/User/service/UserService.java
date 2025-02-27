package com.example.project1.module.User.service;

import com.example.project1.model.dto.UserDto;
import com.example.project1.model.dto.request.UserCreateRequest;
import java.util.List;

public interface UserService {
    UserDto create(UserCreateRequest request);

    UserDto update(UserCreateRequest request,Long id);

    List<UserDto> findAll();

    void delete(Long id);

    UserDto getMyInfo();
}
