package com.example.backend.DTO.Request.serviceResource;

import com.example.backend.Entity.Services;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SRCreateRequest {
    @NotBlank(message = "Không được để trống mã tài nguyên")
    String resourceCode;
    @NotBlank(message = "Không được để trống khu vực")
    String location;
    @NotBlank(message = "Không được để trống id dịch vụ")
    Integer serviceId;
    @NotBlank(message = "Không được để trống trạng thái")
    Boolean isAvailable;
}
