package com.example.backend.Entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Authorities")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Authority {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RoleId", nullable = false)
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PermissionId", nullable = false)
    private Permission permission;
}
