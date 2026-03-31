package com.example.backend.DTO.Request.apartmentType;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApartmentTypeUpdateRequest {
    String name;
    BigDecimal designSqrt;
    Integer numberOfBedroom = 1;
    Integer numberOfBathroom = 1;
    String overview;
    BigDecimal commonPriceForBuying;
    BigDecimal commonPriceForRent;
    Integer furnitureTypeId;
}
