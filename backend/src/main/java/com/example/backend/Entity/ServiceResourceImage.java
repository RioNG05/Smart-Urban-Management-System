package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ServiceResourceImages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceResourceImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ServiceResourceId", nullable = false)
    private ServiceResource serviceResource;

    @Column(name = "ImageUrl", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String imageUrl;

    @Column(name = "Description", length = 255)
    private String description;
}