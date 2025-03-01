package com.example.project1.model.dto;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.util.Date;

@Data
public class UserDto {

    private Long id;

    private String fullName;

    private String email;

    private String phone;

    private String password;

    private int facebookAccountId;

    private int googleAccountId;

    private String avatar;

}
