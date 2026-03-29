package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "IoT_Sync_Logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class IoTSyncLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // FK Apartment
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ApartmentId", nullable = false)
    private Apartment apartment;

    @Column(name = "ElectricityEndNum", precision = 10, scale = 2, nullable = false)
    private BigDecimal electricityEndNum;

    @Column(name = "WaterEndNum", precision = 10, scale = 2, nullable = false)
    private BigDecimal waterEndNum;

    @Column(name = "LogDate")
    private LocalDateTime logDate;
}