package com.example.backend.DTO.Request.iot;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class IoTSyncLogCreateRequest {

    private Integer apartmentId;

    private BigDecimal electricityEndNum;
    private BigDecimal waterEndNum;
}