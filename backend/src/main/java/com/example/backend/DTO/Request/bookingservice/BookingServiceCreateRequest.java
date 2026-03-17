package com.example.backend.DTO.Request.bookingservice;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class BookingServiceCreateRequest {

    @NotNull
    private Integer resourceId;

    @NotNull
    private Integer accountId;

    @NotNull
    private LocalDateTime bookFrom;

    @NotNull
    private LocalDateTime bookTo;

    private Integer status;

    private BigDecimal totalAmount;
}