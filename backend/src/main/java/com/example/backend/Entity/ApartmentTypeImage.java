package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ApartmentTypeImages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApartmentTypeImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ApartmentTypeId", nullable = false)
    private ApartmentType apartmentType;

    @Column(name = "ImageUrl", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String imageUrl;
}