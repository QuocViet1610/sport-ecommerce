package com.example.project1.model.dto;

import com.example.project1.model.enity.Role;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Date;
import java.util.Set;

@Data
public class UserDto {

    private Long id;

    private String fullName;

    private String phoneNumber;

    private String address;

    private String password;

    private boolean active;

    private Date dateOfBirth;

    private int facebookAccountId;

    private int googleAccountId;

}
