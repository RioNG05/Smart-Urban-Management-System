package com.example.backend.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ApartmentResponse {
    Integer id;
    String roomNumber;
    Integer floorNumber;
    String direction;
    Integer furniture;
    Integer status;
    BigDecimal specificPriceForBuying;
    BigDecimal specificPriceForRenting;
    Integer apartmentTypeId;
}