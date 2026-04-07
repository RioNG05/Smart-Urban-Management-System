package com.example.backend.DTO.Request.payment;

import com.example.backend.Enum.InvoiceType;
import com.example.backend.validation.constraint.ValidPaymentRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ValidPaymentRequest
public class PaymentRequest {
    private BigDecimal amount;
    private String orderInfo;
    private Integer[] invoiceId;
    private InvoiceType invoiceType;
    private Integer invoiceMonth;
    private Integer invoiceYear;
}
