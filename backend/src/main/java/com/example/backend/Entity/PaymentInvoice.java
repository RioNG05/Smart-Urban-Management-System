package com.example.backend.Entity;

import com.example.backend.Enum.InvoiceStatus;
import com.example.backend.Enum.InvoiceType;
import com.example.backend.Enum.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Entity
@Table(name = "PaymentInvoice")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PaymentId", nullable = false)
    @JsonIgnore
    private Payment payment;

    @Column(name="InvoiceId",  nullable = false)
    private Integer invoiceId;

    @Column(name = "InvoiceType", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private InvoiceType invoiceType;

    @Column(name = "InvoiceMonth", nullable = false)
    private Integer invoiceMonth;

    @Column(name = "InvoiceYear", nullable = false)
    private Integer invoiceYear;

    @Column(name = "Amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal amount;
}
