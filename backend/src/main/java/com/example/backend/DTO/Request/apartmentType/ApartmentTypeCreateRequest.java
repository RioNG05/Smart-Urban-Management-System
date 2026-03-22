package com.example.backend.DTO.Request.apartmentType;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
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
    @NotBlank(message = "Không được để trống tên kiểu phòng")
    String name;
    @NotBlank(message = "Không được để trống kích thước")
    BigDecimal designSqrt;
    @NotBlank(message = "Không được để trống số phòng ngủ")
    Integer numberOfBedroom;            //Defaut: 1
    @NotBlank(message = "Không được để trống số phòng tắm")
    Integer numberOfBathroom;           //Defaut: 1
    String overview;
    @NotBlank(message = "Không được để trống giá mua")
    BigDecimal commonPriceForBuying;
    @NotBlank(message = "Không được để trống giá thuê")
    BigDecimal commonPriceForRent;
    @NotBlank(message = "Không được để trống kiểu nội thất")
    Integer furniture;                  //Defaut: 0
}
