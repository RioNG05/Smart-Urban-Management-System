package com.example.backend.DTO.Request.stayAtHistory;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SAHCreateRequest {
    @NotBlank(message = "Không được để trống id cư dân")
    Integer residentId;
    @NotBlank(message = "Không được để trống id căn hộ")
    Integer apartmentId;
    @NotBlank(message = "Không được để trống ngày đi vào")
    LocalDate moveIn;
    @NotBlank(message = "Không được để trống ngày đi ra")
    LocalDate moveOut;
}
