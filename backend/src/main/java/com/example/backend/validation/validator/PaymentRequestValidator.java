package com.example.backend.validation.validator;

import com.example.backend.DTO.Request.payment.PaymentRequest;
import com.example.backend.Enum.InvoiceType;
import com.example.backend.validation.constraint.ValidPaymentRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PaymentRequestValidator implements ConstraintValidator<ValidPaymentRequest, PaymentRequest> {
    @Override
    public void initialize(ValidPaymentRequest constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(PaymentRequest value, ConstraintValidatorContext context) {
        if(value == null) return true;
        if(value.getInvoiceType().equals(InvoiceType.UTILITIES_INVOICE) && value.getInvoiceId() == null){
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate("invoiceId must not be null when invoiceType is UTILITIES")
                        .addPropertyNode("invoiceId")
                        .addConstraintViolation();

                return false;
            }

        return true;
    }
}
