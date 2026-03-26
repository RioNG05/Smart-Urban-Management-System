package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "Services")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
public class Services {
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

    @Column(name = "Description", length = Integer.MAX_VALUE)
    private String description;

    @Column(name = "ImageUrl", length = Integer.MAX_VALUE)
    private String imageUrl;

    @Column(name = "IsBookable")
    private boolean isBookable;
}