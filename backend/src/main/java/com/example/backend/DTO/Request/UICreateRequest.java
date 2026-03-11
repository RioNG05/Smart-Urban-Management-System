package com.example.backend.DTO.Request;

import com.example.backend.Entity.Apartment;
import jakarta.persistence.*;
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
public class UICreateRequest {
    Apartment apartment;
    Integer billingMonth;
    Integer billingYear;
    BigDecimal totalElectricUsed;
    BigDecimal totalWaterUsed;
    Integer status = 0;


}
