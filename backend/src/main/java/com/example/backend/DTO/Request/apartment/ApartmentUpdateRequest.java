package com.example.backend.DTO.Request.apartment;

import lombok.*;
import lombok.experimental.FieldDefaults;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApartmentUpdateRequest {

    Integer roomNumber;
    Integer floorNumber;
    String direction;
    Integer status;
    Integer apartmentTypeId;
}