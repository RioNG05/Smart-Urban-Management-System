package com.example.backend.Controllers;

import com.example.backend.DTO.Response.ImageResponseDTO;
import com.example.backend.Service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

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
    @GetMapping("/apartment-type")
    public List<ImageResponseDTO> getAllApartmentImages() {
        return imageService.getAllApartmentImages();
    }
    @GetMapping("/service-resource")
    public List<ImageResponseDTO> getAllServiceImages() {
        return imageService.getAllServiceImages();
    }
    @PutMapping("/apartment-type/{imageId}")
    public Map<String, String> updateApartmentImage(
            @PathVariable Integer imageId,
            @RequestParam(required = false) MultipartFile file) {

        String url = imageService.updateApartmentImage(imageId, file);
        return Map.of("imageUrl", url);
    }
    @PutMapping("/service-resource/{imageId}")
    public Map<String, String> updateServiceImage(
            @PathVariable Integer imageId,
            @RequestParam(required = false) MultipartFile file,
            @RequestParam(required = false) String description) {

        String url = imageService.updateServiceImage(imageId, file, description);
        return Map.of("imageUrl", url);
    }
    @DeleteMapping("/apartment-type/{imageId}")
    public Map<String, String> deleteApartmentImage(@PathVariable Integer imageId) {

        imageService.deleteApartmentImage(imageId);
        return Map.of("message", "Deleted successfully");
    }
    @DeleteMapping("/service-resource/{imageId}")
    public Map<String, String> deleteServiceImage(@PathVariable Integer imageId) {

        imageService.deleteServiceImage(imageId);
        return Map.of("message", "Deleted successfully");
    }
}