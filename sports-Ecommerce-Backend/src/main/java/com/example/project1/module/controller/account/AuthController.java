package com.example.project1.module.controller.account;
import com.example.project1.model.dto.ResponseResult;
import com.example.project1.model.dto.User.UserDto;
import com.example.project1.model.dto.request.AuthenticationRequest;
import com.example.project1.model.dto.request.IntrospectionRequest;
import com.example.project1.model.dto.request.RegisterRequest;
import com.example.project1.model.dto.request.VerificationOtp;
import com.example.project1.model.dto.respone.AuthenticationResponse;
import com.example.project1.module.User.service.serviceImpl.AuthenticationServiceImpl;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.SignedJWT;
import jakarta.mail.MessagingException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.Date;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {

    AuthenticationServiceImpl authenticationService;

    @PostMapping("/login")
    ResponseResult<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) throws MessagingException {
        var result = authenticationService.authenticate(request);
        return ResponseResult.ofSuccess(result);
    }

    @PostMapping("/introspect")
    ResponseResult<Boolean> authenticate(@RequestBody IntrospectionRequest request)
            throws ParseException, JOSEException {
        return ResponseResult.ofSuccess(authenticationService.introspection(request));

    }


    @PostMapping("/register")
    public ResponseResult<Boolean> register(@RequestBody RegisterRequest request) {
        return ResponseResult.ofSuccess(authenticationService.register(request));
    }

    @PostMapping("/verify-otp")
    public ResponseResult<UserDto> verifyOtp(@RequestBody VerificationOtp verificationOtp) {
        return ResponseResult.ofSuccess(authenticationService.verifyOtp(verificationOtp));
    }

}
