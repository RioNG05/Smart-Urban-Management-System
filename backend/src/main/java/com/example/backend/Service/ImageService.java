package com.example.backend.Service;

import com.example.backend.DTO.Response.ImageResponseDTO;
import com.example.backend.Entity.*;
import com.example.backend.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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
    public List<ImageResponseDTO> getAllApartmentImages() {
        return apartmentTypeImageRepository
                .findAllByOrderByApartmentTypeIdAscIdAsc()
                .stream()
                .map(img -> ImageResponseDTO.builder()
                        .id(img.getId())
                        .imageUrl(img.getImageUrl())
                        .description(null)
                        .apartmentTypeId(
                                img.getApartmentType() != null ? img.getApartmentType().getId() : null
                        )
                        .serviceResourceId(null)
                        .build())
                .toList();
    }
    public List<ImageResponseDTO> getAllServiceImages() {
        return serviceResourceImageRepository
                .findAllByOrderByServiceResourceIdAscIdAsc()
                .stream()
                .map(img -> ImageResponseDTO.builder()
                        .id(img.getId())
                        .imageUrl(img.getImageUrl())
                        .description(img.getDescription())
                        .apartmentTypeId(null)
                        .serviceResourceId(
                                img.getServiceResource() != null ? img.getServiceResource().getId() : null
                        )
                        .build())
                .toList();
    }
    public String updateApartmentImage(Integer imageId, MultipartFile file) {

        ApartmentTypeImage image = apartmentTypeImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        // nếu có file mới thì upload lại
        if (file != null && !file.isEmpty()) {
            String newUrl = imageUploadService.uploadFile(file);
            image.setImageUrl(newUrl);
        }

        apartmentTypeImageRepository.save(image);

        return image.getImageUrl();
    }
    public String updateServiceImage(Integer imageId, MultipartFile file, String description) {

        ServiceResourceImage image = serviceResourceImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        // update ảnh nếu có file mới
        if (file != null && !file.isEmpty()) {
            String newUrl = imageUploadService.uploadFile(file);
            image.setImageUrl(newUrl);
        }

        // update description nếu có
        if (description != null) {
            image.setDescription(description);
        }

        serviceResourceImageRepository.save(image);

        return image.getImageUrl();
    }
    public void deleteApartmentImage(Integer imageId) {

        ApartmentTypeImage image = apartmentTypeImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        // xóa cloudinary
        imageUploadService.deleteFile(image.getImageUrl());

        // xóa DB
        apartmentTypeImageRepository.delete(image);
    }
    public void deleteServiceImage(Integer imageId) {

        ServiceResourceImage image = serviceResourceImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        imageUploadService.deleteFile(image.getImageUrl());

        serviceResourceImageRepository.delete(image);
    }


}
