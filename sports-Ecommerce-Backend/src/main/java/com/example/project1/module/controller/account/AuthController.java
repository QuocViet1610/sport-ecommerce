package com.example.project1.module.controller.account;
import com.example.project1.model.dto.ResponseResult;
import com.example.project1.model.dto.request.AuthenticationRequest;
import com.example.project1.model.dto.request.IntrospectionRequest;
import com.example.project1.model.dto.respone.AuthenticationResponse;
import com.example.project1.module.User.service.serviceImpl.AuthenticationServiceImpl;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.util.Date;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    AuthenticationServiceImpl authenticationService;

    @PostMapping("/token")
    ResponseResult<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        var result = authenticationService.authenticate(request);
        return ResponseResult.ofSuccess(result);
    }

    @PostMapping("/introspect")
    ResponseResult<Boolean> authenticate(@RequestBody IntrospectionRequest request)
            throws ParseException, JOSEException {
        return ResponseResult.ofSuccess(authenticationService.introspection(request));

    }

}
