package com.example.backend.DTO.Request.visitorlog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VisitorCreateRequest {

    @NotBlank(message = "Tên khách không được để trống")
    private String visitorName;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String phoneNumber;

    @NotNull(message = "ApartmentId không được để trống")
    private Integer apartmentId;

    @NotNull(message = "StaffId không được để trống")
    private Integer staffId;

    private String note;
}