package com.example.backend.DTO.Request.service;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServicesCreateRequest {
    @NotBlank(message = "Không được để trống tên dịch vụ")
    String serviceName;
    @NotBlank(message = "Không được để trống mã dịch vụ")
    String serviceCode;
    @NotBlank(message = "Không được để trống đơn giá")
    BigDecimal feePerUnit;
    @NotBlank(message = "Không được để trống đơn vị")
    String unitType;
}
