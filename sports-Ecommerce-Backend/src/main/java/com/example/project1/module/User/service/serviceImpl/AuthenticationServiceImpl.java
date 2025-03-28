package com.example.project1.module.User.service.serviceImpl;

import com.example.project1.expection.ValidateException;
import com.example.project1.local.Translator;
import com.example.project1.model.dto.User.UserDto;
import com.example.project1.model.dto.request.*;
import com.example.project1.model.dto.respone.AuthenticationResponse;
import com.example.project1.model.enity.User.User;
import com.example.project1.model.enity.User.UserVerification;
import com.example.project1.module.User.repository.UserRepository;
import com.example.project1.module.User.repository.UserRoleRepository;
import com.example.project1.module.User.repository.UserVerificationRepository;
import com.example.project1.module.User.service.AuthenticationService;
import com.example.project1.module.User.service.UserService;
import com.example.project1.utils.TokenUtil;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationServiceImpl implements AuthenticationService {

    UserRepository userRepository;
    UserRoleRepository userRoleRepository;
    EmailService emailService;
    TokenUtil tokenUtil;
    UserVerificationRepository userVerificationRepository;
    UserVerificationService userVerificationService;
    UserService userService;


    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new ValidateException("error.user.user_name.not_exist"));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated)
        {
            throw new ValidateException("error.user.password.not_exist");
        }
        var token = tokenUtil.generateToken(user);

        return AuthenticationResponse.builder().token(token).authenticated(true).build();
    }

    @Override
    public Boolean introspection(IntrospectionRequest request) throws JOSEException, ParseException {
        return tokenUtil.validateToken(request.getToken());
    }

    public Boolean register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ValidateException(Translator.toMessage("error.user.email.exists"));
        }

        if (userRepository.findByPhone(request.getPhone()).isPresent()) {
            throw new ValidateException(Translator.toMessage("error.user.phone.exists"));
        }

        if (!request.getPassword().equals(request.getPasswordConfirm())) {
            throw new ValidateException(Translator.toMessage("error.user.password.mismatch"));
        }

        String otp = userVerificationService.generateOtp();
        emailService.sendVerificationEmail(request.getEmail(), otp);
        userVerificationService.saveOtp(request, otp);

        return true;
    }

    public Boolean sendOtp(RegisterRequest request) {
        String otp = userVerificationService.generateOtp();
        emailService.sendVerificationEmail(request.getEmail(), otp);
        userVerificationService.saveOtp(request, otp);
        return true;
    }

    public UserDto verifyOtp(VerificationOtp verificationOtp) {
        UserVerification userVerification = userVerificationService.verifyOtp(verificationOtp.getEmail(), verificationOtp.getOtp());
        return userService.register(userVerification);
    }

}
