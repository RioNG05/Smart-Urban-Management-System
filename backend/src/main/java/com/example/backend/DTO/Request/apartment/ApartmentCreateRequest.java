package com.example.backend.DTO.Request.apartment;

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
public class ApartmentCreateRequest {
    @NotNull(message = "Không được để trống số phòng")
    Integer roomNumber;
    @NotNull(message = "Không được để trống số tầng")
    Integer floorNumber;
    String direction;
    @NotNull(message = "Không được để trống tình trạng phòng")
    Integer status;
    @NotNull(message = "Không được để trống id kiểu căn hộ")
    Integer apartmentTypeId;
}