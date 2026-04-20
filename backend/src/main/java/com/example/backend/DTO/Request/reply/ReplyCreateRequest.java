package com.example.backend.DTO.Request.reply;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReplyCreateRequest {

    @NotBlank(message = "Reply content must not be blank")
    @Size(max = 2000, message = "Content must not exceed 2000 characters")
    String content;

    Integer complaintId;

    @NotNull(message = "UserId must not be blank")
    Integer userId;

}