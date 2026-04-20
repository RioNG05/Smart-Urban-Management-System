package com.example.backend.DTO.Request.staff;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StaffCreateRequest {

    @NotBlank(message = "Staff name must not be blank")
    private String fullName;

    private String gender;

    private LocalDate dateOfBirth;

    @NotBlank(message = "IdentityId must not be blank")
    private String identityId;

    @NotNull(message = "AccountId must not be blank")
    private Integer accountId;
}