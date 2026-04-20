package com.example.backend.DTO.Request.account;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountCreateRequest {

    @NotBlank(message = "Email must not be blank")
    String email;

    @NotBlank(message = "Username must not be blank")
    @Size(min = 6, message = "Username must be at least 6 characters")
    String username;

    @NotBlank(message = "Password must not be blank")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])\\S+$",
            message = "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character. Password cannot contain spaces"
    )
    String password;
    Integer roleId;
    @Builder.Default
    Boolean isActive = true;

    public Integer getRoleId() {
        return 6;
    }

    public Boolean getActive() {
        return true;
    }

}
