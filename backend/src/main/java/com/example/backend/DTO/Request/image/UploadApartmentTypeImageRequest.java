package com.example.backend.DTO.Request.image;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UploadApartmentTypeImageRequest {
    private Integer apartmentTypeId;
    private MultipartFile file;
}