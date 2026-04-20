package com.example.backend.DTO.Request.service;

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
public class ServicesCreateRequest {
    @NotBlank(message = "Service name must not be blank")
    String serviceName;
    @NotBlank(message = "Service code must not be blank")
    String serviceCode;
    @NotNull(message = "Unit price must not be blank")
    BigDecimal feePerUnit;
    @NotBlank(message = "Unit must not be blank")
    String unitType;
    @NotBlank(message = "Description must not be blank")
    String description;
    @NotBlank(message = "Image url must not be blank")
    String imageUrl;
    @NotNull(message = "Status must not be blank")
    boolean isBookable;
}
