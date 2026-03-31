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
    @NotNull(message = "Không được để trống số phòng")
    @Min(value = 1, message = "roomNumber must be bigger than 1")
    Integer roomNumber;
    @NotNull(message = "Không được để trống số tầng")
    @Min(value = 1, message = "floorNumber must be bigger than 1")
    Integer floorNumber;
    String direction;
    @NotNull(message = "Không được để trống tình trạng phòng")
    Integer status;
    @NotNull(message = "Không được để trống id kiểu căn hộ")
    @Min(value = 1, message = "apartmentType must be bigger than 1")
    Integer apartmentTypeId;
}