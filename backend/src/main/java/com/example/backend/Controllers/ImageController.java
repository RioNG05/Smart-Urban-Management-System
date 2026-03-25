package com.example.backend.Controllers;

import com.example.backend.Service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @PostMapping("/apartment-type")
    public String uploadApartmentTypeImage(
            @RequestParam Integer apartmentTypeId,
            @RequestParam MultipartFile file) {

        return imageService.uploadApartmentTypeImage(apartmentTypeId, file);
    }

    @PostMapping("/service-resource")
    public String uploadServiceResourceImage(
            @RequestParam Integer serviceResourceId,
            @RequestParam MultipartFile file,
            @RequestParam(required = false) String description) {

        return imageService.uploadServiceResourceImage(serviceResourceId, file, description);
    }
}