package com.example.backend.DTO.Request.apartment;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApartmentCreateRequest {
    @NotNull(message = "Room number must not be blank")
    @Min(value = 1, message = "roomNumber must be bigger than 1")
    Integer roomNumber;
    @NotNull(message = "Floor number must not be blank")
    @Min(value = 1, message = "floorNumber must be bigger than 1")
    Integer floorNumber;
    String direction;
    @NotNull(message = "Room status must not be blank")
    Integer status;
    @NotNull(message = "Apartment type id must not be blank")
    @Min(value = 1, message = "apartmentType must be bigger than 1")
    Integer apartmentTypeId;
}