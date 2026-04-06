package com.example.backend.DTO.Request.stayAtHistory;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SAHCreateRequest {
    @NotNull(message = "Không được để trống id cư dân")
    Integer residentId;
    @NotNull(message = "Không được để trống id căn hộ")
    Integer apartmentId;
    @NotNull(message = "Không được để trống ngày đi vào")
    LocalDate moveIn;
    
    LocalDate moveOut;
}
