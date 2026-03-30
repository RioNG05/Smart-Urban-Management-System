package com.example.backend.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dhsvpyt18",
                "api_key", "299225532973921",
                "api_secret", "zHy8uBfZoGEds-NFOt8bv5JUPhI"
        ));
    }
}

