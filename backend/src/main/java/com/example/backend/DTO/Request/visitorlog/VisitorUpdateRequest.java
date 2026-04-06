package com.example.backend.DTO.Request.visitorlog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VisitorUpdateRequest {

    @NotBlank(message = "Visitor name must not be blank")
    private String visitorName;

    @NotBlank(message = "Identity card must not be blank")
    private String identityCard;

    @NotBlank(message = "Phone number must not be blank")
    private String phoneNumber;

    @NotNull(message = "ApartmentId must not be null")
    private Integer apartmentId;

    private String note;
}
