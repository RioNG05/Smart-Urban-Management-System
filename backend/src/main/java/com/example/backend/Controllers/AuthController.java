package com.example.backend.Controllers;


import com.example.backend.DTO.Response.*;
import com.example.backend.DTO.Request.auth.AuthenticationRequest;
import com.example.backend.DTO.Request.auth.IntrospectRequest;
import com.example.backend.Entity.Account;
import com.example.backend.Entity.Resident;
import com.example.backend.Repository.AccountRepository;
import com.example.backend.Service.AuthenticationService;
import com.example.backend.Service.ResidentService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {

    AuthenticationService authenticationService;
    AccountRepository accountRepository;
    ResidentService residentService;

    @PostMapping("/token")
    ApiResponse<AutheticationResponse> authenticate(@RequestBody AuthenticationRequest req) {

        var result = authenticationService.authenticated(req);

        return ApiResponse.<AutheticationResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest req) throws ParseException, JOSEException {

        var result = authenticationService.introspect(req);

        return ApiResponse.<IntrospectResponse>builder()
                .result(result)
                .build();
    }

    @GetMapping("/accounts/me")
    ApiResponse<AccountsResponse> me(Authentication authentication){

        String username = authentication.getName();

        Optional<Account> account = accountRepository.findByUsername(username);

        Account acc = account.orElseThrow();

        AccountsResponse response = AccountsResponse.builder()
                .id(acc.getId())
                .username(acc.getUsername())
                .email(acc.getEmail())
                .role(acc.getRole())
                .build();

        return ApiResponse.<AccountsResponse>builder()
                .result(response)
                .build();
    }

    @GetMapping("/profile/me")
    ApiResponse<ResidentsResponse> profile(Authentication authentication){

        String username = authentication.getName();

        Optional<Account> account = accountRepository.findByUsername(username);

        Account acc = account.orElseThrow();

        Resident resident = residentService.findByAccountId(acc.getId());

        AccountsResponse accountsResponse = AccountsResponse.builder()
                .id(acc.getId())
                .username(acc.getUsername())
                .email(acc.getEmail())
                .role(acc.getRole())
                .build();

        ResidentsResponse response = ResidentsResponse.builder()
                .id(resident.getId())
                .fullName(resident.getFullName())
                .account(accountsResponse)
                .gender(resident.getGender())
                .dateOfBirth(resident.getDateOfBirth())
                .identityId(resident.getIdentityId())
                .phoneNumber(resident.getPhoneNumber())
                .build();

        return ApiResponse.<ResidentsResponse>builder()
                .result(response)
                .build();
    }
}