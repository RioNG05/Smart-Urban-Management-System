package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "GetInTouch")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GetInTouch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(name = "Message", columnDefinition = "NVARCHAR(MAX)", nullable = false)
    private String message;

    @Column(insertable = false, updatable = false)
    private LocalDateTime createdAt;
}