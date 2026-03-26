package com.example.backend.DTO.Request.appointment;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AppointmentUpdateRequest {

    private String location;
    private String title;
    private String note;
    private Integer userId;
    private Integer assignedTo;
    private LocalDate meetingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status;
}
