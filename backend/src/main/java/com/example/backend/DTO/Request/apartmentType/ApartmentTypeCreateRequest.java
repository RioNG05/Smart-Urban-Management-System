package com.example.backend.DTO.Request.apartmentType;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApartmentTypeCreateRequest {
    String name;
    BigDecimal designSqrt;
    Integer numberOfBedroom;            //Defaut: 1
    Integer numberOfBathroom;           //Defaut: 1
    String overview;
    BigDecimal commonPriceForBuying;
    BigDecimal commonPriceForRent;
    Integer furniture;                  //Defaut: 0
}
