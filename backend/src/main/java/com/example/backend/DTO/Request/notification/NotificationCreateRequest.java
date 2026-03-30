package com.example.backend.DTO.Request.notification;

import lombok.Data;

@Data
public class NotificationCreateRequest {

    private Integer receiverId;   // null nếu gửi chung
    private String targetRole;    // ADMIN / STAFF

    private String title;
    private String message;
    private String type;

    private String relatedUrl;
}