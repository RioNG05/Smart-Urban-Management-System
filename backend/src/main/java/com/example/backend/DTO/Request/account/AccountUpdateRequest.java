package com.example.backend.DTO.Request.account;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountUpdateRequest {

    String email;
    String username;
    String password;
    Integer roleId;
    Boolean isActive;
}
