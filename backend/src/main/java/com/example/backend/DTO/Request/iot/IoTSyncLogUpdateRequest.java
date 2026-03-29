package com.example.backend.DTO.Request.iot;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class IoTSyncLogUpdateRequest {

    private BigDecimal electricityEndNum;
    private BigDecimal waterEndNum;
}