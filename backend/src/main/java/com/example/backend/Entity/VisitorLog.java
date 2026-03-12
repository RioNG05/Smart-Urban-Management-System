package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "VisitorLogs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VisitorLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "VisitorName", nullable = false, length = 255)
    private String visitorName;

    @Column(name = "PhoneNumber", nullable = false, length = 20)
    private String phoneNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ApartmentId", nullable = false)
    private Apartment apartment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CreatedByStaffId", nullable = false)
    private StaffInfo createdByStaff;

    @Column(name = "CheckInTime")
    private LocalDateTime checkInTime;

    @Column(name = "Note", columnDefinition = "NVARCHAR(MAX)")
    private String note;
}