package com.example.backend.Entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Accounts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "Email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name="Username", nullable = false, unique = true,length = 50)
    private String username;

    @Column(name = "Password", nullable = false, length = 255)
    private String password;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RoleId", nullable = false)
    private Role role;

    @Column(name = "IsActive")
    private Boolean isActive = true;
}