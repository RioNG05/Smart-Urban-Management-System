package com.example.backend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.time.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Apartments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Apartment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "RoomNumber", nullable = false, length = 20)
    private Integer roomNumber;

    @Column(name = "FloorNumber", nullable = false)
    private Integer floorNumber;

    @Column(name = "Direction", length = 50)
    private String direction;

    @Column(name = "Status")
    private Integer status = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ApartmentTypeId", nullable = false)
    @JsonIgnore
    private ApartmentType apartmentType;

    @JsonProperty("apartmentTypeId")
    public Integer getApartmentTypeId() {
        return apartmentType != null ? apartmentType.getId() : null;
    }
}
