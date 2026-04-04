package com.example.backend.validation.validator;

import com.example.backend.DTO.Request.bookingservice.BookingServiceCreateRequest;
import com.example.backend.DTO.Request.bookingservice.BookingServiceUpdateRequest;
import com.example.backend.validation.constraint.AfterStartDate;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDateTime;

public class AfterStartDateValidator
        implements ConstraintValidator<AfterStartDate, Object> {

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {

        if (value == null) return true;

        LocalDateTime from = null;
        LocalDateTime to = null;

        if (value instanceof BookingServiceCreateRequest req) {
            from = req.getBookFrom();
            to = req.getBookTo();
        } else if (value instanceof BookingServiceUpdateRequest req) {
            from = req.getBookFrom();
            to = req.getBookTo();
        }

        if (from == null || to == null) return true;

        if (to.isAfter(from)) return true;

        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate("bookTo must be after bookFrom")
                .addPropertyNode("bookTo")
                .addConstraintViolation();

        return false;
    }
}