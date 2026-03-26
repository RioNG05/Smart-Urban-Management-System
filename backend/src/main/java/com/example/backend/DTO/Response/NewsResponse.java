package com.example.backend.DTO.Response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class NewsResponse {
    Integer id;
    String title;
    String content;
    String imageUrl;
    LocalDateTime lastUpdate;
    NewsAuthorResponse createdByUser;
}
