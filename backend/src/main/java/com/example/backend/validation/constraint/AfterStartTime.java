package com.example.backend.validation.constraint;

import com.example.backend.validation.validator.AppointmentTimeValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = {
        AppointmentTimeValidator.class
})
public @interface AfterStartTime {
    String message() default "End time after before start time";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
