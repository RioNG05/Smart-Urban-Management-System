package com.example.backend.DTO.Request.image;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UploadServiceResourceImageRequest {
    private Integer serviceResourceId;
    private MultipartFile file;
    private String description;
}