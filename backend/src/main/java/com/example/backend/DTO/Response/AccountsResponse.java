package com.example.backend.DTO.Response;

import com.example.backend.Entity.Role;
import jakarta.validation.constraints.Email;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class AccountsResponse {
    String username;
    String password;
    Role role;
    String email;
}
