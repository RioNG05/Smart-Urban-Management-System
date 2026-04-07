package com.example.backend.Entity;

import com.example.backend.Enum.InvoiceType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "Amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "TransactionId", length = 100)
    private String transactionId;

    @Column(name = "OrderInfo")
    private String orderInfo;

    @Column(name = "PaymentGateway", length = 50)
    private String paymentGateway;

    @Column(name = "PaymentStatus")
    private Integer paymentStatus;

    @Column(name = "PaymentDate", updatable = false, insertable = false)
    private LocalDateTime paymentDate;

    @Column(name = "CreatedAt", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (paymentGateway == null) {
            paymentGateway = "VNPAY";
        }
        if (paymentStatus == null) {
            paymentStatus = 0;
        }
    }
}
