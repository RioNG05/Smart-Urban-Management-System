package com.example.backend.DTO.Request.serviceResource;

import com.example.backend.Entity.Services;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SRUpdateRequest {
    String resourceCode;
    String location;
    Integer serviceId;
    Boolean isAvailable;
}
