package com.example.backend.DTO.Response;

import com.example.backend.Entity.Account;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ResidentsResponse {
    Integer id;
    String fullName;
    String gender;
    LocalDate dateOfBirth;
    String phoneNumber;
    String identityId;
    AccountsResponse account;
}
