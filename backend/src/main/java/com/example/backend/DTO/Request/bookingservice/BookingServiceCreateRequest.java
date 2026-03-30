package com.example.backend.DTO.Request.bookingservice;

import com.example.backend.validation.constraint.DateAfterDays;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class BookingServiceCreateRequest {

    @NotNull(message = "resourceId can not be empty")
    private Integer resourceId;

    @NotNull(message = "accountId can not be empty")
    private Integer accountId;

    @NotNull(message = "bookFrom can not be empty")
    @DateAfterDays(days = 1, message = "service must be reserve before 1 day")
    private LocalDateTime bookFrom;

    @NotNull

    private LocalDateTime bookTo;

    private Integer status;

    private BigDecimal totalAmount;
}