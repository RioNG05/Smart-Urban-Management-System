package com.example.backend.DTO.Response;

import com.example.backend.Entity.Account;
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
    Integer id;
    String username;
    Role role;
    String email;
}
