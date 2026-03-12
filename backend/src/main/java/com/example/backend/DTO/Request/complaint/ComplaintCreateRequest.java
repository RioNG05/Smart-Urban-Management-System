package com.example.backend.DTO.Request.complaint;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ComplaintCreateRequest {

    @NotBlank
    private String content;

    @NotNull
    private Integer userId;
}