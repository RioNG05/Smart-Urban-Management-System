package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;
import java.math.BigDecimal;

@Entity
@Table(name = "ServiceResources")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ServiceResource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "ResourceCode", unique = true, length = 50)
    private String resourceCode;

    @Column(name = "Location", length = 255)
    private String location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ServiceId", nullable = false)
    private Service service;

    @Column(name = "IsAvailable")
    private Boolean isAvailable = true;
}
