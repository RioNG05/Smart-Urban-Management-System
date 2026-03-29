package com.example.backend.Entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Residents")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
public class Resident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "FullName", nullable = false, length = 100)
    private String fullName;

    @Column(name = "Gender", length = 10)
    private String gender;

    @Column(name = "DateOfBirth")
    private LocalDate dateOfBirth;

    @Column(name = "IdentityId", nullable = false, unique = true, length = 20)
    private String identityId;

    @Column(name = "PhoneNumber", length = 15)
    private String phoneNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AccountId")
    private Account account;
}