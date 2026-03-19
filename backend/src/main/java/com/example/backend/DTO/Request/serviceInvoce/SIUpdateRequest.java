package com.example.backend.DTO.Request.serviceInvoce;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SIUpdateRequest {
    private Integer bookingServiceId;
    private BigDecimal amount;
    private Integer status = 0;
    private LocalDateTime paymentDate;
}
