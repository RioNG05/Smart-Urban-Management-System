package com.example.backend.DTO.Request;

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
<<<<<<< HEAD
    Boolean isActive;
=======
    Boolean isActive = true;
>>>>>>> 7556d3b09e62fb6b078dcc54df4950da91a18a6c
}
