package com.example.backend.validation.validator;

import com.example.backend.DTO.Request.appointment.AppointmentCreateRequest;
import com.example.backend.DTO.Request.bookingservice.BookingServiceCreateRequest;
import com.example.backend.validation.constraint.AfterStartDate;
import com.example.backend.validation.constraint.AfterStartTime;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.awt.print.Book;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Objects;

public class BookingDateValidator implements ConstraintValidator<AfterStartDate, BookingServiceCreateRequest> {

    @Override
    public void initialize(AfterStartDate constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(BookingServiceCreateRequest req, ConstraintValidatorContext constraintValidatorContext) {
        if(req == null){
            return true;
        }

        LocalDateTime startDate = req.getBookFrom();
        LocalDateTime endDate = req.getBookTo();

        if(Objects.isNull(startDate) || Objects.isNull(endDate)){
            return true;
        }

        if(endDate.isAfter(startDate)){
            return true;
        }

        constraintValidatorContext.disableDefaultConstraintViolation();
        constraintValidatorContext.buildConstraintViolationWithTemplate("End time must be after start time")
                .addPropertyNode("bookTo") // gắn vào field
                .addConstraintViolation();

        return false;
    }
}
