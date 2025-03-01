package com.example.project1.module.User.service;

import com.example.project1.model.dto.request.AuthenticationRequest;
import com.example.project1.model.dto.request.IntrospectionRequest;
import com.example.project1.model.dto.respone.AuthenticationResponse;
import com.nimbusds.jose.JOSEException;

import java.text.ParseException;

public interface AuthenticationService {
    public AuthenticationResponse authenticate(AuthenticationRequest request);
    public Boolean introspection(IntrospectionRequest request) throws JOSEException, ParseException;
}
