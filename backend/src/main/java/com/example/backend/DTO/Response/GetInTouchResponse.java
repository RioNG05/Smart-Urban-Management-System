package com.example.backend.DTO.Response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class GetInTouchResponse {

    private Integer id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String message;
    private LocalDateTime createdAt;
}