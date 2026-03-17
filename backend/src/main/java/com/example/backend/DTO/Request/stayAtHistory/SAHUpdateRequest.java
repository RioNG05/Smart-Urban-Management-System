package com.example.backend.DTO.Request.stayAtHistory;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SAHUpdateRequest {
    Integer residentId;
    Integer apartmentId;
    LocalDate moveIn;
    LocalDate moveOut;
}
