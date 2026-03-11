package com.example.backend.DTO.Request;

import com.example.backend.Entity.Apartment;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UIUpdateRequest {
    Apartment apartment;
    Integer billingMonth;
    Integer billingYear;
    BigDecimal totalElectricUsed;
    BigDecimal totalWaterUsed;
    BigDecimal totalAmount;
    Integer status = 0;
}
