package com.example.backend.validation.constraint;

import com.example.backend.validation.validator.AfterStartDateValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = {
        AfterStartDateValidator.class
})
public @interface AfterStartDate {

    String message() default "bookTo must be after bookFrom";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}