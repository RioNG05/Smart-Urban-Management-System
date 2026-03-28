package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Notifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Người nhận (có thể null)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ReceiverId")
    private Account receiver;

    @Column(name = "TargetRole", length = 50)
    private String targetRole;

    @Column(name = "Title", nullable = false, length = 200)
    private String title;

    @Column(name = "Message", nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String message;

    @Column(name = "Type", length = 50)
    private String type;

    @Column(name = "IsRead")
    private Boolean isRead = false;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    @Column(name = "RelatedUrl", length = 255)
    private String relatedUrl;
}