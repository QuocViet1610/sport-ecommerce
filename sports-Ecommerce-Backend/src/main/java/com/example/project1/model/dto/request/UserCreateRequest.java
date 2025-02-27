package com.example.project1.model.dto.request;

import com.example.project1.model.enity.Role;
import com.example.project1.validator.Dateconstraint;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;
import java.util.Set;

@Data
public class UserCreateRequest {

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
