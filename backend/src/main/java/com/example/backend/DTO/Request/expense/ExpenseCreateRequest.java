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

    @NotBlank(message = "Title must not be blank")
    String title;

    String description;

    @NotNull(message = "apartmentId must not be blank")
    Integer apartmentId;

    @NotNull(message = "createdBy must not be blank")
    Integer createdById;

    @NotNull(message = "amount must not be blank")
    BigDecimal amount;

    @NotNull(message = "expenseDate must not be blank")
    LocalDate expenseDate;

    Integer status = 0;
}