package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;
import java.math.BigDecimal;

@Entity
@Table(name = "StayAtHistory")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
public class StayAtHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ResidentId", nullable = false)
    private Resident resident;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ApartmentId", nullable = false)
    private Apartment apartment;

    @Column(name = "MoveIn", nullable = false)
    private LocalDate moveIn;

    @Column(name = "MoveOut")
    private LocalDate moveOut;
}

