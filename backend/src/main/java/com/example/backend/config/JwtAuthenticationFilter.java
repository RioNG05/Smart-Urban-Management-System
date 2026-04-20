package com.example.backend.config;

import com.example.backend.Entity.Account;
import com.example.backend.Repository.AccountRepository;
import com.example.backend.Service.AuthenticationService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.text.ParseException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final AuthenticationService authenticationService;

    private final AccountRepository accountRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);


        try {
//            var result = authenticationService.introspect(
//                    IntrospectRequest.builder()
//                            .token(token)
//                            .build()
//            );
//
//            if(!result.isValid()){
//                filterChain.doFilter(Request,response);
//                return;
//            }

            String username = authenticationService.extractUsername(token);

            if(username != null){

                Account account = accountRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("Can not found username: " +username));

                if (Boolean.FALSE.equals(account.getIsActive())) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Your account is disabled");
                    return;
                }

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                account,
                                null,
                                account.getAuthorities()
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

        } catch (ParseException ex) {
            System.out.println("JWT token parse error");
        }

        filterChain.doFilter(request, response);
    }
}

