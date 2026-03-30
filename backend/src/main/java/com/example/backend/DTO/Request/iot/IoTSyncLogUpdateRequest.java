package com.example.backend.DTO.Request.iot;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class IoTSyncLogUpdateRequest {

    Integer apartmentId;
    BigDecimal electricityEndNum;
    BigDecimal waterEndNum;
}