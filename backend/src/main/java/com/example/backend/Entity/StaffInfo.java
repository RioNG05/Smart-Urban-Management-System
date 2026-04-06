package com.example.backend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "StaffInfo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StaffInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "FullName", nullable = false, length = 255)
    private String fullName;

    @Column(name = "Gender", length = 10)
    private String gender;

    @Column(name = "DateOfBirth")
    private LocalDate dateOfBirth;

    @Column(name = "IdentityId", unique = true, length = 20)
    private String identityId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AccountId", nullable = false)
    private Account account;

    @OneToMany(mappedBy = "createdByStaff")
    @JsonIgnore
    private List<VisitorLog> visitorLogs;
}
