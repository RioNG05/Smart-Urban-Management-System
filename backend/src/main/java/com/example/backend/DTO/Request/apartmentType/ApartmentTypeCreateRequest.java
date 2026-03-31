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
    @NotBlank(message = "Không được để trống tên kiểu phòng")
    String name;
    @NotNull(message = "Không được để trống kích thước")
    BigDecimal designSqrt;
    @NotNull(message = "Không được để trống số phòng ngủ")
    Integer numberOfBedroom;            //Defaut: 1
    @NotNull(message = "Không được để trống số phòng tắm")
    Integer numberOfBathroom;           //Defaut: 1
    String overview;
    @NotNull(message = "Không được để trống giá mua")
    BigDecimal commonPriceForBuying;
    @NotNull(message = "Không được để trống giá thuê")
    BigDecimal commonPriceForRent;
    @NotNull(message = "Không được để trống kiểu nội thất")
    Integer furnitureTypeId;
}
