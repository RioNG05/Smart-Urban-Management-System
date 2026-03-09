package com.example.backend.DTO.Request;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

<<<<<<< HEAD
    int code = 200;
=======
    int code;
>>>>>>> 7556d3b09e62fb6b078dcc54df4950da91a18a6c
    String message;
    T result;
}
