package com.example.backend.DTO.Request.payment;

import com.example.backend.DTO.Request.payment_invoice.PaymentInvoiceCreateRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private BigDecimal amount;
    private String orderInfo;
    private List<PaymentInvoiceCreateRequest> invoices;
}
