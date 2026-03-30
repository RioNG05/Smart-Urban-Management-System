package com.example.backend.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ImageResponseDTO {
    private Integer id;
    private String imageUrl;
    private String description;
}
