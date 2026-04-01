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

    @NotBlank(message = "Email không được để trống")
    String email;

    @NotBlank(message = "Tên người dùng không được để trống")
    @Size(min = 6, message = "Tên người dùng phải có ít nhất 6 ký tự")
    String username;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 8, message = "Mật khẩu phải có ít nhất 8 ký tự")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])\\S+$",
            message = "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 kí tự đặc biệt. Mật khẩu không được chứa dấu cách"
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
