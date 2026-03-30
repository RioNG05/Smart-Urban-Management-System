package com.example.backend.DTO.Request.utilitiesInvoice;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UICreateRequest {
    @NotNull(message = "Không được để trống id căn hộ")
    Integer apartmentId;
    @NotNull(message = "Không được để trống tháng làm hoá đơn")
    Integer billingMonth;
    @NotNull(message = "Không được để trống năm làm hoá đơn")
    Integer billingYear;
    Integer status = 0;
}
