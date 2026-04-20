package com.example.backend.DTO.Request.contract;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ContractCreateRequest {
    @NotNull(message = "Apartment id must not be blank")
    Integer apartmentId;
    @NotNull(message = "Owner account id must not be blank")
    Integer accountId;
    @NotBlank(message = "Contract type must not be blank")
    String contractType;
    @NotNull(message = "Effective date must not be blank")
    LocalDate startDate;
    @NotNull(message = "Expiration date must not be blank")
    LocalDate endDate;
    @NotNull(message = "Rent price must not be blank")
    BigDecimal monthlyRent;
    @NotNull(message = "Creator id must not be blank")
    Integer createdById;
    @NotNull(message = "Contract status must not be blank")
    Integer status = 1;
}
