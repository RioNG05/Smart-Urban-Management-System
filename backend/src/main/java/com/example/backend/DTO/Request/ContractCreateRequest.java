package com.example.backend.DTO.Request;

import com.example.backend.Entity.Account;
import com.example.backend.Entity.Apartment;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ContractCreateRequest {
    Integer apartmentId;
    Integer accountId;
    String contractType;
    LocalDate startDate;
    LocalDate endDate;
    BigDecimal monthlyRent;
    Integer status = 1;
}
