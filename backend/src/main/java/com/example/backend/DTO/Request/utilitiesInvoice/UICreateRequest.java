package com.example.backend.DTO.Request.utilitiesInvoice;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UICreateRequest {
    @NotNull(message = "Apartment id must not be blank")
    Integer apartmentId;
    @NotNull(message = "Billing month must not be blank")
    Integer billingMonth;
    @NotNull(message = "Billing year must not be blank")
    Integer billingYear;
    Integer status = 0;
}
