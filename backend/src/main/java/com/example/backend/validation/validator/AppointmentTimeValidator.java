package com.example.backend.validation.validator;

import com.example.backend.DTO.Request.appointment.AppointmentCreateRequest;
import com.example.backend.validation.constraint.AfterStartTime;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalTime;
import java.util.Objects;

public class AppointmentTimeValidator implements ConstraintValidator<AfterStartTime, AppointmentCreateRequest> {

    @Override
    public void initialize(AfterStartTime constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(AppointmentCreateRequest req, ConstraintValidatorContext constraintValidatorContext) {
        if(req == null){
            return true;
        }

        LocalTime startTime = req.getStartTime();
        LocalTime endTime = req.getEndTime();

        if(Objects.isNull(startTime) || Objects.isNull(endTime)){
            return true;
        }

        if(endTime.isAfter(startTime)){
            return true;
        }

        constraintValidatorContext.disableDefaultConstraintViolation();
        constraintValidatorContext.buildConstraintViolationWithTemplate("End time must be after start time")
                .addPropertyNode("endTime") // gắn vào field
                .addConstraintViolation();

        return false;
    }
}
