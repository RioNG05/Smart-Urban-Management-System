package com.example.backend.DTO.Request.mandatoryService;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MandatoryServicesCreateRequest {
    @NotBlank(message = "Service name must not be blank")
    String serviceName;
    @NotBlank(message = "Service code must not be blank")
    String serviceCode;
    @NotNull(message = "Unit price must not be blank")
    BigDecimal basePrice;
    @NotBlank(message = "Unit must not be blank")
    String unitType;
    @NotBlank(message = "Description must not be blank")
    String description;
}
