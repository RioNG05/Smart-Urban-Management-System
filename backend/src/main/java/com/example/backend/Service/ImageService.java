package com.example.backend.Service;

import com.example.backend.Entity.*;
import com.example.backend.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final ApartmentTypeRepository apartmentTypeRepository;
    private final ServicesResourceRepository serviceResourceRepository;
    private final ApartmentTypeImageRepository apartmentTypeImageRepository;
    private final ServiceResourceImageRepository serviceResourceImageRepository;
    private final ImageUploadService imageUploadService;

    public String uploadApartmentTypeImage(Integer apartmentTypeId, MultipartFile file) {

        ApartmentType apartmentType = apartmentTypeRepository.findById(apartmentTypeId)
                .orElseThrow(() -> new RuntimeException("ApartmentType not found"));

        String url = imageUploadService.uploadFile(file);

        ApartmentTypeImage image = new ApartmentTypeImage();
        image.setApartmentType(apartmentType);
        image.setImageUrl(url);

        apartmentTypeImageRepository.save(image);

        return url;
    }

    public String uploadServiceResourceImage(Integer resourceId, MultipartFile file, String description) {

        ServiceResource resource = serviceResourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        String url = imageUploadService.uploadFile(file);

        ServiceResourceImage image = new ServiceResourceImage();
        image.setServiceResource(resource);
        image.setImageUrl(url);
        image.setDescription(description);

        serviceResourceImageRepository.save(image);

        return url;
    }
}