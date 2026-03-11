package com.example.backend.DTO.Request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ContractUpdateRequest {
    Integer apartmentId;
    Integer accountId;
    String contractType;
    LocalDate startDate;
    LocalDate endDate;
    BigDecimal monthlyRent;
    Integer status = 1;
}
