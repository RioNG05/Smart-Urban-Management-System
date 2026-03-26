package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "Appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Khách hàng
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserId", nullable = true)
    private Account user;

    // Nhân viên được giao
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AssignedTo", nullable = true)
    private Account assignedTo;

    // Người tạo
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CreatedBy", nullable = false)
    private Account createdBy;

    @Column(nullable = false)
    private String location;

    private String title;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String note;

    @Column(nullable = false)
    private LocalDate meetingDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    private String status = "Pending";

    private LocalDateTime createdAt;
}