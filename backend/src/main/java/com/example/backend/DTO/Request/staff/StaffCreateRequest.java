package com.example.backend.DTO.Request.staff;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StaffCreateRequest {

    @NotBlank(message = "Tên nhân viên không được để trống")
    private String fullName;

    private String gender;

    private LocalDate dateOfBirth;

    @NotBlank(message = "IdentityId không được để trống")
    private String identityId;

    @NotNull(message = "AccountId không được để trống")
    private Integer accountId;
}