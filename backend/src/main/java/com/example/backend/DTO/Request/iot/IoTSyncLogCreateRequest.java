package com.example.backend.DTO.Request.iot;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class IoTSyncLogCreateRequest {

    @NotNull(message = "Không được để trống apartmentId")
    Integer apartmentId;

    @NotNull(message = "Không được để trống điện")
    BigDecimal electricityEndNum;

    @NotNull(message = "Không được để trống nước")
    BigDecimal waterEndNum;
}