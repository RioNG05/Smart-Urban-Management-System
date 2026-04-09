package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ServiceResources")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
public class ServiceResource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "ResourceCode", unique = true, length = 50)
    private String resourceCode;

    @Column(name = "Location", length = 255)
    private String location;

    @Column(name = "ImageUrl", columnDefinition = "NVARCHAR(MAX)")
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ServiceId", nullable = false)
    private Services service;

    @Column(name = "IsAvailable")
    private Boolean isAvailable = true;
}
