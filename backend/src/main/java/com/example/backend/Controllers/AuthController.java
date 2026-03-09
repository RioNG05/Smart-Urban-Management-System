package com.example.backend.Controllers;

<<<<<<< HEAD
import com.example.backend.DTO.Request.ApiResponse;
import com.example.backend.DTO.Request.AuthenticationRequest;
import com.example.backend.DTO.Request.IntrospectRequest;
import com.example.backend.DTO.Response.AutheticationResponse;
import com.example.backend.DTO.Response.IntrospectResponse;
import com.example.backend.Service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
=======
import com.example.backend.DTO.Request.LoginRequest;
import com.example.backend.Entity.Account;
import com.example.backend.Repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
>>>>>>> 7556d3b09e62fb6b078dcc54df4950da91a18a6c
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

<<<<<<< HEAD
import java.text.ParseException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {

    AuthenticationService authenticationService;

=======
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

>>>>>>> 7556d3b09e62fb6b078dcc54df4950da91a18a6c
//    @Autowired
//    private AccountRepository repository;
//
//    @PostMapping("/login")
//    public Map<String, String> login(@RequestBody LoginRequest req){
//
//        Account account = repository.findByUsername(req.getUsername())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
//
//        if(!encoder.matches(req.getPassword(), account.getPassword())){
//            throw new RuntimeException("Wrong password");
//        }
//
//        String token = JwtUtil.generateToken(account.getUsername());
//
//        return Map.of("token", token);
//    }
<<<<<<< HEAD

    @PostMapping("/token")
    ApiResponse<AutheticationResponse> authenticate(@RequestBody AuthenticationRequest req){

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
=======
>>>>>>> 7556d3b09e62fb6b078dcc54df4950da91a18a6c
}