package com.example.backend.Exception;

import com.example.backend.DTO.Response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<ApiResponse> handleRuntimeException(RuntimeException ex){

        ApiResponse response = new ApiResponse();

        response.setCode(500);
        response.setMessage(ex.getMessage());

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse> handleValidation(MethodArgumentNotValidException ex){
        ApiResponse response = new ApiResponse();
        String errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error ->  error.getDefaultMessage())
                .collect(Collectors.joining(". "));
        response.setCode(400);
        response.setMessage(errors);

        return ResponseEntity.badRequest().body(response);
    }
}
