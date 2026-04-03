package com.example.backend.DTO.Request.contract;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ContractCreateRequest {
    @NotNull(message = "Không được để trống id căn hộ")
    Integer apartmentId;
    @NotNull(message = "Không được để trống id tài khoản sở hữu")
    Integer accountId;
    @NotBlank(message = "Không được để trống kiểu hợp đồng")
    String contractType;
    @NotNull(message = "Không được để trống ngày có hiệu lực")
    LocalDate startDate;
    @NotNull(message = "Không được để trống ngày hết hiệu lực")
    LocalDate endDate;
    @NotNull(message = "Không được để trống giá thuê")
    BigDecimal monthlyRent;
    @NotNull(message = "Không được để trống id người tạo hợp đồng")
    Integer createdById;
    @NotNull(message = "Không được để trống tình trạng hợp đồng")
    Integer status = 1;
}
