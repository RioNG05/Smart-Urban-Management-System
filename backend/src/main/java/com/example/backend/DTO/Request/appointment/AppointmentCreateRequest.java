package com.example.backend.DTO.Request.appointment;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AppointmentCreateRequest {

    private Integer userId;
    private Integer assignedTo;

    @NotNull
    private Integer createdBy;

    @NotBlank
    private String location;

    private String title;

    private String note;

    @NotNull
    private LocalDate meetingDate;

    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime endTime;
}