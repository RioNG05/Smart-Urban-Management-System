package com.example.backend.DTO.Request.visitorlog;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VisitorUpdateRequest {

    @NotBlank(message = "Tên khách không được để trống")
    private String visitorName;

    @NotBlank(message = "CCCD không được để trống")
    private String identityCard;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String phoneNumber;

    private String note;
}