package com.example.backend.DTO.Request.resident;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResidentCreateRequest {
    @NotBlank(message = "Resident name must not be blank")
    String fullName;
    String gender;
    @NotNull(message = "Date of birth must not be blank")
    LocalDate dateOfBirth;
    @NotBlank(message = "Identity card must not be blank")
    String identityId;
    @NotBlank(message = "Phone number must not be blank")
    String phoneNumber;
    @NotNull(message = "Registration account id must not be blank")
    Integer accountId;
}
