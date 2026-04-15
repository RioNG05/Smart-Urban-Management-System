package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import java.time.LocalDateTime;

@Entity
@Table(name = "VisitorLogs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitorLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "VisitorName", nullable = false, length = 255)
    private String visitorName;

    @Column(name = "IdentityCard", nullable = false, length = 20)
    private String identityCard;

    @Column(name = "PhoneNumber", nullable = false, length = 20)
    private String phoneNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ApartmentId", nullable = false)
    private Apartment apartment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CreatedByStaffId", nullable = false)
    @NotFound(action = NotFoundAction.IGNORE)
    private StaffInfo createdByStaff;

    @Column(name = "CheckInTime")
    private LocalDateTime checkInTime;

    @Column(name = "Note", columnDefinition = "NVARCHAR(MAX)")
    private String note;
}
