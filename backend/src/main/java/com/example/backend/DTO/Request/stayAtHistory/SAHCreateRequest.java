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
    @NotNull(message = "Resident id must not be blank")
    Integer residentId;
    @NotNull(message = "Apartment id must not be blank")
    Integer apartmentId;
    @NotNull(message = "Move-in date must not be blank")
    LocalDate moveIn;
    
    LocalDate moveOut;
}
