package com.example.backend.DTO.Request.apartmentType;

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
public class ApartmentTypeCreateRequest {
    @NotBlank(message = "Room type name must not be blank")
    String name;
    @NotNull(message = "Size must not be blank")
    BigDecimal designSqrt;
    @NotNull(message = "Number of bedrooms must not be blank")
    Integer numberOfBedroom;            //Defaut: 1
    @NotNull(message = "Number of bathrooms must not be blank")
    Integer numberOfBathroom;           //Defaut: 1
    String overview;
    @NotNull(message = "Purchase price must not be blank")
    BigDecimal commonPriceForBuying;
    @NotNull(message = "Rent price must not be blank")
    BigDecimal commonPriceForRent;
    @NotNull(message = "Furniture type must not be blank")
    Integer furnitureTypeId;
}
