package com.example.backend.DTO.Request.utilitiesInvoice;

import com.example.backend.Entity.Apartment;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UICreateRequest {
    @NotBlank(message = "Không được để trống id căn hộ")
    Integer apartmentId;
    @NotBlank(message = "Không được để trống tháng làm hoá đơn")
    Integer billingMonth;
    @NotBlank(message = "Không được để trống năm làm hoá đơn")
    Integer billingYear;
    @NotBlank(message = "Không được để trống tổng số điện đã dùng")
    Integer totalElectricUsed;
    @NotBlank(message = "Không được để trống tổng số nước đã dùng")
    Integer totalWaterUsed;
    Integer status = 0;
}
