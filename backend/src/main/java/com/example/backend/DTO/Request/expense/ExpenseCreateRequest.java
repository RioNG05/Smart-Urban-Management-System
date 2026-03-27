package com.example.backend.DTO.Request.expense;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExpenseCreateRequest {

    @NotBlank(message = "Không được để trống tiêu đề")
    String title;

    String description;

    @NotNull(message = "Không được để trống apartmentId")
    Integer apartmentId;

    @NotNull(message = "Không được để trống createdBy")
    Integer createdById;

    @NotNull(message = "Không được để trống amount")
    BigDecimal amount;

    @NotNull(message = "Không được để trống expenseDate")
    LocalDate expenseDate;

    Integer status = 0;
}