package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "Services")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "ServiceName", nullable = false, length = 100)
    private String serviceName;

    @Column(name = "ServiceCode", unique = true, length = 50)
    private String serviceCode;

    @Column(name = "FeePerUnit", precision = 18, scale = 2)
    private BigDecimal feePerUnit;

    @Column(name = "UnitType", length = 50)
    private String unitType;
}