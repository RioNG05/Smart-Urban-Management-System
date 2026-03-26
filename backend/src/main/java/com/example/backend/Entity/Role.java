package com.example.backend.Entity;
import com.example.backend.Enum.RoleEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
<<<<<<< HEAD
import org.springframework.security.core.parameters.P;

import java.util.HashSet;
import java.util.Set;
=======
>>>>>>> c6f5a04 (Sửa hiển thị role trong api)

@Entity
@Table(name = "Roles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "RoleName", nullable = false, unique = true, length = 50)
<<<<<<< HEAD
    @Enumerated(EnumType.STRING)
    private RoleEnum roleName;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name="Authorities",
            joinColumns = @JoinColumn(name = "RoleId"),
            inverseJoinColumns = @JoinColumn(name = "PermissionId")
    )
    @JsonIgnore
    private Set<Permission> permissions = new HashSet<>();
=======
    private String roleName;
>>>>>>> c6f5a04 (Sửa hiển thị role trong api)
}