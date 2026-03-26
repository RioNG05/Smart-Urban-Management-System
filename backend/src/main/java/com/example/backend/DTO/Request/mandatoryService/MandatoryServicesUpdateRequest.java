package com.example.backend.DTO.Request.mandatoryService;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MandatoryServicesUpdateRequest {
    String serviceName;
    String serviceCode;
    BigDecimal basePrice;
    String unitType;
    String description;
}
