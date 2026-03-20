package com.example.backend.DTO.Request.resident;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResidentCreateRequest {
    String fullName;
    String gender;
    LocalDate dateOfBirth;
    String identityId;
    Integer accountId;
}
