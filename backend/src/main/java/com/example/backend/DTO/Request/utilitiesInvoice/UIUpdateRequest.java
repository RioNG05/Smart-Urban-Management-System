package com.example.backend.DTO.Request.utilitiesInvoice;

import com.example.backend.Entity.Apartment;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

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
