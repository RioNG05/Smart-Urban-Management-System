package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Apartments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Apartment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "RoomNumber", nullable = false, length = 20)
    private String roomNumber;

    @Column(name = "FloorNumber", nullable = false)
    private Integer floorNumber;

    @Column(name = "Direction", length = 50)
    private String direction;

    @Column(name = "Status")
    private Integer status = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ApartmentTypeId", nullable = false)
    private ApartmentType apartmentType;
}
