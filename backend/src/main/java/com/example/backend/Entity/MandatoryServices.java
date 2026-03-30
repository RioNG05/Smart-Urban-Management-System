package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "MandatoryServices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MandatoryServices {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "ServiceName", nullable = false, length = 100)
    private String serviceName;

    @Column(name = "ServiceCode", unique = true, length = 50)
    private String serviceCode;

    @Column(name = "BasePrice", precision = 18, scale = 2)
    private BigDecimal basePrice;

    @Column(name = "UnitType", length = 50)
    private String unitType;

    @Column(name = "Description", columnDefinition = "NVARCHAR(MAX)")
    private String description;
}
