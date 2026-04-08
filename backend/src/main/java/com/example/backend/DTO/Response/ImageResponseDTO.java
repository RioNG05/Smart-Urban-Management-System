package com.example.backend.DTO.Response;

import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageResponseDTO {
    private Integer id;
    private String imageUrl;
    private String description;
    private Integer apartmentTypeId;
    private Integer serviceResourceId;
}
