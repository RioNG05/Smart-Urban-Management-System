package com.example.backend.Service;

import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ImageUploadService {

    private final Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    Map.of("resource_type", "auto")
            );
            return uploadResult.get("secure_url").toString();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Upload failed: " + e.getMessage());
        }
    }
    public void deleteFile(String imageUrl) {
        try {
            // extract public_id từ URL
            String publicId = extractPublicId(imageUrl);

            cloudinary.uploader().destroy(publicId, Map.of());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Delete failed: " + e.getMessage());
        }
    }
    private String extractPublicId(String imageUrl) {
        try {
            String[] parts = imageUrl.split("/");
            String fileName = parts[parts.length - 1]; // sample.jpg
            return fileName.substring(0, fileName.lastIndexOf(".")); // sample
        } catch (Exception e) {
            throw new RuntimeException("Invalid image URL");
        }
    }
}