package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CollectionId;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ServiceInvoices")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
public class ServiceInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ServiceBookingId", nullable = false)
    private BookingService bookingService;

    @Column(name = "Amount", nullable = false, precision = 18, scale = 2)
    private BigDecimal amount;

    @Column(name = "Status")
    private Integer status = 0;

    @Column(name = "PaymentDate")
    private LocalDateTime paymentDate;

    @Column(name = "CreatedAt", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
