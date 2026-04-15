package com.example.backend.DTO.Request.visitorlog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VisitorCreateRequest {

    @NotBlank(message = "Visitor name must not be blank")
    String visitorName;

    @NotBlank(message = "Identity card must not be blank")
    String identityCard;

    @NotBlank(message = "Phone number must not be blank")
    String phoneNumber;

    @NotNull(message = "ApartmentId must not be null")
    Integer apartmentId;

    @NotNull(message = "StaffId must not be null")
    Integer staffId;

    String note;
}
