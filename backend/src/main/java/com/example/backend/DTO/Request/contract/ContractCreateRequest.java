package com.example.backend.DTO.Request.contract;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ContractCreateRequest {
    @NotBlank(message = "Không được để trống id căn hộ")
    Integer apartmentId;
    @NotBlank(message = "Không được để trống id tài khoản sở hữu")
    Integer accountId;
    @NotBlank(message = "Không được để trống kiểu hợp đồng")
    String contractType;
    @NotBlank(message = "Không được để trống ngày có hiệu lực")
    LocalDate startDate;
    @NotBlank(message = "Không được để trống ngày hết hiệu lực")
    LocalDate endDate;
    @NotBlank(message = "Không được để trống giá thuê")
    BigDecimal monthlyRent;
    @NotBlank(message = "Không được để trống id người tạo hợp đồng")
    Integer createdById;
    @NotBlank(message = "Không được để trống tình trạng hợp đồng")
    Integer status = 1;
}
