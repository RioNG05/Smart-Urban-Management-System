package com.example.backend.validation.constraint;

import com.example.backend.validation.validator.DateAfterDaysLocalDateTimeValidator;
import com.example.backend.validation.validator.DateAfterDaysLocalDateValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = {
        DateAfterDaysLocalDateValidator.class,
        DateAfterDaysLocalDateTimeValidator.class
})
public @interface DateAfterDays {
    String message() default "Date must be after some days";

    int days();

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
