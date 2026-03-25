package com.example.backend.Service;

import com.cloudinary.Cloudinary;
import com.example.backend.DTO.Response.CloudinaryResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {
    @Autowired
    private Cloudinary cloudinary;

    @Transactional
    public CloudinaryResponse uploadfile(final MultipartFile file,final String name){
        try {
            final Map result = cloudinary.uploader().upload(file.getBytes(), Map.of("public_id", "api/image/" + name));
            final String url = (String) result.get("secure_url");
            final String publicId = (String) result.get("public_id");
            return CloudinaryResponse.builder()
                    .publicId(publicId)
                    .url(url)
                    .build();

        }catch (final Exception e) {
            throw new RuntimeException("Failed to upload file");
        }
    }
}
