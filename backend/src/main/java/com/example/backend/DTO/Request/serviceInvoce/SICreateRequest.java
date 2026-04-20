package com.example.backend.DTO.Request.serviceInvoce;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SICreateRequest {
    @NotBlank(message = "Booking service id must not be blank")
    private Integer bookingServiceId;
    @NotBlank(message = "Price must not be blank")
    private BigDecimal amount;
    private Integer status = 0;
    private LocalDateTime paymentDate;
}
