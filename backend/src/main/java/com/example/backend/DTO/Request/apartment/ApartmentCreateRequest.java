package com.example.backend.DTO.Request.apartment;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApartmentCreateRequest {
    @NotBlank(message = "Không được để trống số phòng")
    Integer roomNumber;
    @NotBlank(message = "Không được để trống số tầng")
    Integer floorNumber;
    String direction;
    @NotBlank(message = "Không được để trống tình trạng phòng")
    Integer status;
    @NotBlank(message = "Không được để trống id kiểu căn hộ")
    Integer apartmentTypeId;
}