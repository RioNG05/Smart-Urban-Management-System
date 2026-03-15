package com.example.backend.DTO.Request.staff;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StaffUpdateRequest {

    private String fullName;

    private String gender;

    private LocalDate dateOfBirth;

    private String identityId;
}