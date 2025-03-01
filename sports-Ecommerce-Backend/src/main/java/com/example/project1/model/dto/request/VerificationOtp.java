package com.example.project1.model.dto.request;

import lombok.Data;

@Data
public class VerificationOtp {
    private String email;
    private String otp;
}
