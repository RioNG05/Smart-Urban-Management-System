package com.example.backend.config.Security;

import com.example.backend.DTO.Request.account.AccountCreateRequest;
import com.example.backend.Entity.Account;
import com.example.backend.Repository.AccountRepository;
import com.example.backend.Service.AccountService;
import com.example.backend.Service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class    OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    AccountRepository accountRepository;
    AuthenticationService authenticationService;
    AccountService accountService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest  req, HttpServletResponse res, Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");

        Optional<Account> account = accountRepository.findByEmail(email);

        System.out.println("===== GOOGLE ATTRIBUTES =====");

        oAuth2User.getAttributes().forEach((key, value) -> {
            System.out.println(key + " : " + value);
        });

        System.out.println("=============================");

        if(account.isEmpty()){
            AccountCreateRequest account1 =  AccountCreateRequest.builder()
                    .email(email)
                    .username(email)
                    .password("Abc12345@")
                    .roleId(2)
                    .isActive(true)
                    .build();

            accountService.create(account1);

            String token = authenticationService.tokenGeneration(account1.getUsername());
            getRedirectStrategy().sendRedirect(
                    req,res,"http://localhost:5173/?token=" + token
            );
            return;
        }
        Account account1 = account.get();

        String token = authenticationService.tokenGeneration(account1.getUsername());

        getRedirectStrategy().sendRedirect(req, res, "http://localhost:5173/?token="+token);
    }

}
