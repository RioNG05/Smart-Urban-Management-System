package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Contracts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
public class Contract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ApartmentId", nullable = false)
    private Apartment apartment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AccountId", nullable = false)
    private Account account;

    @Column(name = "ContractType", length = 50)
    private String contractType;

    @Column(name = "StartDate", nullable = false)
    private LocalDate startDate;

    @Column(name = "EndDate")
    private LocalDate endDate;

    @Column(name = "MonthlyRent", precision = 18, scale = 2)
    private BigDecimal monthlyRent;

    @Column(name = "Status")
    private Integer status = 1;

    @Column(name = "CreatedAt", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "CreatedById", nullable = false)
    private Integer createdById;                     // id của staff tạo ra cái hợp đồng này
}