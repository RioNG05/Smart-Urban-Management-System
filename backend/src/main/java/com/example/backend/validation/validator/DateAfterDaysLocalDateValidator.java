package com.example.backend.validation.validator;

import com.example.backend.validation.constraint.DateAfterDays;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;
import java.util.Objects;

public class DateAfterDaysLocalDateValidator implements ConstraintValidator<DateAfterDays, LocalDate> {

    private int days;

    @Override
    public void initialize(DateAfterDays constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
        this.days = constraintAnnotation.days();
    }

    @Override
    public boolean isValid(LocalDate value, ConstraintValidatorContext constraintValidatorContext) {
        if(Objects.isNull(value)) {
            return true;
        }

        LocalDate minDay = LocalDate.now().plusDays(days);
        return !value.isBefore(minDay);
    }
}
