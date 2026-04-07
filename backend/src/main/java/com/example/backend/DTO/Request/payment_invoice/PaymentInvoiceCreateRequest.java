package com.example.backend.DTO.Request.payment_invoice;

import com.example.backend.Enum.InvoiceType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentInvoiceCreateRequest {
    Integer paymentId;
    Integer invoiceId;
    @Enumerated(EnumType.STRING)
    InvoiceType invoiceType;
    Integer invoiceMonth;
    Integer invoiceYear;
}
