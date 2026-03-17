package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;
import java.math.BigDecimal;

@Entity
@Table(name = "UtilitiesInvoices")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
public class UtilitiesInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ApartmentId", nullable = false)
    private Apartment apartment;

    @Column(name = "BillingMonth", nullable = false)
    private Integer billingMonth;

    @Column(name = "BillingYear", nullable = false)
    private Integer billingYear;

    @Column(name = "TotalElectricUsed", precision = 10, scale = 2)
    private BigDecimal totalElectricUsed;

    @Column(name = "TotalWaterUsed", precision = 10, scale = 2)
    private BigDecimal totalWaterUsed;

    @Column(name = "TotalAmount", nullable = false, precision = 18, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "Status")
    private Integer status = 0;

    @Column(name = "CreatedAt", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
