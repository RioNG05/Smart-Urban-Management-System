package com.example.backend.Service;

import com.example.backend.DTO.Request.auth.AuthenticationRequest;
import com.example.backend.DTO.Request.auth.IntrospectRequest;
import com.example.backend.DTO.Response.AutheticationResponse;
import com.example.backend.DTO.Response.IntrospectResponse;
import com.example.backend.Repository.AccountRepository;
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
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
@RequiredArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {

    AccountRepository accountRepository;
    @NonFinal
    @Value("${JWT_TOKEN}")
    String JWT_TOKEN;

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();
        JWSVerifier verifier = new MACVerifier(JWT_TOKEN.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);
        Date expireTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        return IntrospectResponse.builder()
                .valid(signedJWT.verify(verifier) && expireTime.after(new Date()))
                .build();
    }

    public AutheticationResponse authenticated(AuthenticationRequest request){
        var account = accountRepository.findByUsername(request.getUsername()).orElseThrow(() -> new RuntimeException("Incorrect username or password"));

        if (!account.isEnabled()) {
            throw new RuntimeException("Your account is disabled");
        }

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean autheticated = passwordEncoder.matches(request.getPassword(), account.getPassword());

//        if(!autheticated) throw new RuntimeException("Unable to authenticate user");
            if(!autheticated) {
                return AutheticationResponse.builder()
                        .authenticated(false)
                        .build();
            }
        
        var token = tokenGeneration(request.getUsername());

        return AutheticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();

    }

    public String tokenGeneration(String username){
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);

        var account = accountRepository.findByUsername(username).orElseThrow();

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(username)
                .issuer("sums.vn")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()))
                .claim("roleId", account.getRole().getId())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(jwsHeader, payload);
        try{
            jwsObject.sign(new MACSigner(JWT_TOKEN.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            System.err.println("Cannot create token: "+ e);
            throw new RuntimeException(e);
        }
    }

    public String extractUsername(String token) throws ParseException {
        SignedJWT signedJWT = SignedJWT.parse(token);
        return signedJWT.getJWTClaimsSet().getSubject();
    }

}
