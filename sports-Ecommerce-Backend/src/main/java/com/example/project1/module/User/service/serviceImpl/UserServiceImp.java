package com.example.project1.module.User.service.serviceImpl;
import com.example.project1.constant.PredefinedRole;
import com.example.project1.expection.ValidateException;
import com.example.project1.mapper.UserMapper;
import com.example.project1.model.dto.UserDto;
import com.example.project1.model.dto.request.UserCreateRequest;
import com.example.project1.model.enity.Role;
import com.example.project1.model.enity.User;
import com.example.project1.module.User.repository.RoleRepository;
import com.example.project1.module.User.service.UserService;
import com.example.project1.module.User.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImp implements UserService {

    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    RoleRepository roleRepository;
    private void validateLogic(UserCreateRequest request, boolean isCreate){
          if (userRepository.findByUserName(request.getFullName()).isPresent()){
              throw new ValidateException("error.user.user_name.is_exit");
          }
    }

    @Override
    public UserDto create(UserCreateRequest request) {
        this.validateLogic(request,true);
        List<Role> roles = roleRepository.findAllById(request.getRoles());

        User userRequest = userMapper.toEntity(request);
        userRequest.setRoles(new HashSet<>(roles));
        userRequest.setPassword(passwordEncoder.encode(request.getPassword()));


        User user= userRepository.save(userRequest);
        return userMapper.toDto(userRequest);
    }

    @Override
    public UserDto update(UserCreateRequest request,Long id) {
        this.validateLogic(request,true);
        userRepository.findById(id).map(user -> {
            this.validateLogic(request,false);

            return null;
        }).orElseThrow(() -> new ValidateException("error.node.id.not_exist"));
        return null;
    }

    @Override

    public List<UserDto> findAll() {
        return userMapper.toDto(userRepository.findAll());
    }

    @Override
    public void delete(Long id) {

    }

    public UserDto getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = userRepository.findByUserName(name).orElseThrow(() -> new ValidateException("error.user.user_name.not_exist"));

        return userMapper.toDto(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }



}
