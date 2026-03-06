package com.example.backend.Controllers;

import com.example.backend.DTO.Request.LoginRequest;
import com.example.backend.Entity.Account;
import com.example.backend.Repository.AccountRepository;
import com.example.backend.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AccountRepository repository;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequest req){

        Account account = repository.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        if(!encoder.matches(req.getPassword(), account.getPassword())){
            throw new RuntimeException("Wrong password");
        }

        String token = JwtUtil.generateToken(account.getUsername());

        return Map.of("token", token);
    }
}