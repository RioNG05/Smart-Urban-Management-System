package com.example.backend.DTO.Request.apartment;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApartmentCreateRequest {

    Integer roomNumber;
    Integer floorNumber;
    String direction;
    Integer status;
    Integer apartmentTypeId;
}