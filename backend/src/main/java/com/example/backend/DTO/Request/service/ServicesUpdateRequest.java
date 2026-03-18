package com.example.backend.DTO.Request.service;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServicesUpdateRequest {
    String serviceName;
    String serviceCode;
    BigDecimal feePerUnit;
    String unitType;
}
