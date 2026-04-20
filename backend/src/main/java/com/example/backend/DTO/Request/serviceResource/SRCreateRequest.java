package com.example.backend.DTO.Request.serviceResource;

import com.example.backend.Entity.Services;
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
public class SRCreateRequest {
    @NotBlank(message = "Resource code must not be blank")
    String resourceCode;
    @NotBlank(message = "Area must not be blank")
    String location;
    @NotNull(message = "Service id must not be blank")
    Integer serviceId;
    @NotNull(message = "Status must not be blank")
    Boolean isAvailable;
}
