package com.example.backend.DTO.Request.complaint;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ComplaintUpdateRequest {

    @NotNull
    private Integer id;

    @NotBlank
    private String content;

    @NotNull
    private Integer userId;
}