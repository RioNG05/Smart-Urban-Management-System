package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "IoT_Sync_Logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IoTSyncLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ApartmentId", nullable = false)
    private Apartment apartment;

    @Column(name = "ElectricityEndNum", nullable = false, precision = 10, scale = 2)
    private BigDecimal electricityEndNum;

    @Column(name = "WaterEndNum", nullable = false, precision = 10, scale = 2)
    private BigDecimal waterEndNum;

    @Column(name = "LogDate")
    private LocalDateTime logDate;
}