package com.example.backend.DTO.Request.appointment;

import com.example.backend.validation.constraint.AfterStartTime;
import com.example.backend.validation.constraint.DateAfterDays;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AfterStartTime(message = "End time must be after start time")
public class AppointmentCreateRequest {

    @NotNull(message = "userId must not be null")
    @Min(value = 1, message = "userId must be bigger than 1")
    private Integer userId;

    @NotNull(message = "assignedTo must not be null")
    @Min(value = 1, message = "assignTo must be bigger than 1")
    private Integer assignedTo;

    @NotNull(message = "createdBy must not be null")
    @Min(value = 1, message = "createBy must be bigger than 1")
    private Integer createdBy;

    @NotBlank(message = "location can not be empty")
    private String location;

    @NotBlank(message = "title can not be empty")
    private String title;

    private String note;

    @NotNull(message = "meetingDate can not be empty")
    @DateAfterDays(days = 3, message = "Appointment must be reserve after 3 days")
    private LocalDate meetingDate;

    @NotNull(message = "startTime can not be empty")
    private LocalTime startTime;

    @NotNull(message = "endTime can not be empty")
    private LocalTime endTime;
}