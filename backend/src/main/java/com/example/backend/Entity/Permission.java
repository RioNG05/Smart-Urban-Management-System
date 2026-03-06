package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Permissions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "PermissionCode", nullable = false, unique = true, length = 50)
    private String permissionCode;

    @Column(name = "Description", length = 255)
    private String description;
}
