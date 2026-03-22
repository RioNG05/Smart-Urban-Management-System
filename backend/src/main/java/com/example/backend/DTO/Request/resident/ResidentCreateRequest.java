package com.example.backend.DTO.Request.resident;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResidentCreateRequest {
    @NotBlank(message = "Không được để trống tên người dân")
    String fullName;
    String gender;
    @NotBlank(message = "Không được để trống ngày tháng năm sinh")
    LocalDate dateOfBirth;
    @NotBlank(message = "Không được để trống căn cước công dân")
    String identityId;
    @NotBlank(message = "Không được để trống id tài khoản đăng ký")
    Integer accountId;
}
