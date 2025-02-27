package com.example.project1.mapper;
import com.example.project1.model.dto.UserDto;
import com.example.project1.model.dto.request.UserCreateRequest;
import com.example.project1.model.enity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

     @Mapping(target = "roles", ignore = true)
     User toEntity(UserCreateRequest userCreateRequest);

     @Mapping(target = "roles", source = "roles")
     UserDto toDto(User user);

     List<UserDto> toDto(List<User> user);
}
