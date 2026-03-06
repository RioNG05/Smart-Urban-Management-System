package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;
import java.math.BigDecimal;

@Entity
@Table(name = "BookingServices")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class BookingService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ResourceId", nullable = false)
    private ServiceResource serviceResource;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AccountId", nullable = false)
    private Account account;

    @Column(name = "BookAt", insertable = false, updatable = false)
    private LocalDateTime bookAt;

    @Column(name = "BookFrom", nullable = false)
    private LocalDateTime bookFrom;

    @Column(name = "BookTo", nullable = false)
    private LocalDateTime bookTo;

    @Column(name = "Status")
    private Integer status = 0;

    @Column(name = "TotalAmount", precision = 18, scale = 2)
    private BigDecimal totalAmount;
}
