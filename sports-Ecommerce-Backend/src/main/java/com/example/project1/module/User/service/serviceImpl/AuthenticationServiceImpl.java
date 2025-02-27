package com.example.project1.module.User.service.serviceImpl;
import com.example.project1.expection.ValidateException;
import com.example.project1.model.dto.ResponseResult;
import com.example.project1.model.dto.request.AuthenticationRequest;
import com.example.project1.model.dto.request.IntrospectionRequest;
import com.example.project1.model.dto.respone.AuthenticationResponse;
import com.example.project1.model.enity.User;
import com.example.project1.module.User.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationServiceImpl {

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;
    UserRepository userRepository;


    private String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("sport-ecommerce.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user)) // phan quyen
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");

        if (!CollectionUtils.isEmpty(user.getRoles()))
            user.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_" + role.getName());
//              stringJoiner.add(role.getPermissions().stream().map(Permission::getName));
                role.getPermissions().forEach(permission -> {
                    stringJoiner.add(permission.getName());
                });
            });

        return stringJoiner.toString();
    }

    private SecretKey getSignInKey() {
        byte[] decodedKey;
        try {
            decodedKey = Base64.getDecoder().decode(SIGNER_KEY);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid base64 encoding for secret key", e);
        }
        // Sử dụng HMAC SHA để tạo Key từ byte[] đã giải mã
        return new SecretKeySpec(decodedKey, "HmacSHA256"); // Hoặc HmacSHA512, tùy vào yêu cầu
    }

    public Jwt extractAllClaims(String token) {
        // Tạo JwtDecoder từ khóa bí mật (HMAC) de gia ma token
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(getSignInKey()).build();

        // Giải mã và trả về Jwt object chứa các claim
        return jwtDecoder.decode(token);
    }

    public <T> T extractClaim(String token, Function<Jwt, T> claimsResolver) {
        final Jwt claims = this.extractAllClaims(token); // lay doi tuong Claim

        return claimsResolver.apply(claims);
    }

    public String extractUserName(String token){
        return extractClaim(token, s -> s.getSubject());
    }

    public boolean isTokenExpired(String token) {
        Instant expirationInstant = this.extractClaim(token, Jwt::getExpiresAt);
        Date expirationDate = Date.from(expirationInstant);
        return expirationDate.before(new Date());
    }
    public boolean validateToken(String token) {
        try{
            String userName = extractUserName(token);
            return true;
        }catch (Exception e){
            return false;
        }

    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        User user = userRepository
                .findByUserName(request.getUsername())
                .orElseThrow(() -> new ValidateException("error.user.user_name.not_exist"));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated)
        {
            throw new ValidateException("error.user.password.not_exist");
        }
        var token = generateToken(user);

        return AuthenticationResponse.builder().token(token).authenticated(true).build();
    }

    public Boolean introspection(IntrospectionRequest request) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(request.getToken());
        Date expriryTime;
        try{
             expriryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        }catch (Exception e){
            return false;
        }

        boolean verified = signedJWT.verify(verifier) && expriryTime.after(new Date());
        return verified;
    }
}
