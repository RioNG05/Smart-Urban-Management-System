package com.example.backend.DTO.Request.getintouch;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class GetInTouchCreateRequest {

    @NotBlank
    private String fullName;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String phoneNumber;

    @NotBlank
    private String message;
}