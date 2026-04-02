package com.example.backend.validation.constraint;

import com.example.backend.validation.validator.AppointmentTimeValidator;
import com.example.backend.validation.validator.BookingDateValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = {
        BookingDateValidator.class
})
public @interface AfterStartDate {
    String message() default "End date must be after start time";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
