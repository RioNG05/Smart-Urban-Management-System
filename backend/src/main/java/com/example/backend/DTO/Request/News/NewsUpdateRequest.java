package com.example.backend.DTO.Request.News;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NewsUpdateRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    private String imageUrl;

    @NotNull
    private Integer userId;
}