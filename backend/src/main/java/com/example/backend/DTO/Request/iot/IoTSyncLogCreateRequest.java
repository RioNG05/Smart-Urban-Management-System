package com.example.backend.DTO.Request.iot;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class IoTSyncLogCreateRequest {

    @NotNull(message = "apartmentId must not be blank")
    Integer apartmentId;

    @NotNull(message = "Electricity must not be blank")
    BigDecimal electricityEndNum;

    @NotNull(message = "Water must not be blank")
    BigDecimal waterEndNum;

    LocalDateTime logDate;
}