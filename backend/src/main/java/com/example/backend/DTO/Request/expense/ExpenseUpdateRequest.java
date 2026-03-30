package com.example.backend.DTO.Request.expense;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExpenseUpdateRequest {

    String title;
    String description;
    Integer apartmentId;
    Integer createdById;
    BigDecimal amount;
    LocalDate expenseDate;
    Integer status;
}