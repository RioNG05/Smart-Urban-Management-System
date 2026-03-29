package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import tools.jackson.databind.deser.bean.CreatorCandidate;

import java.time.*;
import java.math.BigDecimal;

@Entity
@Table(name = "ApartmentTypes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class ApartmentType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "Name", nullable = false, length = 100)
    private String name;

    @Column(name = "DesignSqrt", precision = 10, scale = 2)
    private BigDecimal designSqrt;

    @Column(name = "NumberOfBedroom")
    private Integer numberOfBedroom = 1;

    @Column(name = "NumberOfBathroom")
    private Integer numberOfBathroom = 1;

    @Column(name = "Overview", columnDefinition = "NVARCHAR(MAX)")
    private String overview;

    @Column(name = "CommonPriceForBuying", precision = 18, scale = 2)
    private BigDecimal commonPriceForBuying;

    @Column(name = "CommonPriceForRent", precision = 18, scale = 2)
    private BigDecimal commonPriceForRent;

    @CreatedDate
    @Column(name = "CreatedAt", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "FurnitureTypeId")
    private FurnitureType furnitureType;

}