package com.example.backend.validation.validator;

import com.example.backend.validation.constraint.DateAfterDays;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDateTime;
import java.util.Objects;

public class DateAfterDaysLocalDateTimeValidator implements ConstraintValidator<DateAfterDays, LocalDateTime> {

    private int days;

    @Override
    public void initialize(DateAfterDays constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
        this.days = constraintAnnotation.days();
    }

    @Override
    public boolean isValid(LocalDateTime value, ConstraintValidatorContext constraintValidatorContext) {
        if(Objects.isNull(value)) {
            return true;
        }

        LocalDateTime minDay = LocalDateTime.now().plusDays(days);
        return !value.isBefore(minDay);
    }
}
