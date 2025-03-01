package com.example.project1.model.dto.request;

import lombok.Data;

import java.time.OffsetDateTime;


@Data
public class RegisterRequest {

    private Long id;

    private String fullName;

    private String email;

    private String phone;

    private String password;

    private String passwordConfirm;

}
