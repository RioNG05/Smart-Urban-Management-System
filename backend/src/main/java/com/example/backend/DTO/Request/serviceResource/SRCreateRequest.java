package com.example.backend.DTO.Request.serviceResource;

import com.example.backend.Entity.Services;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SRCreateRequest {
    String resourceCode;
    String location;
    Integer serviceId;
    Boolean isAvailable;
}
