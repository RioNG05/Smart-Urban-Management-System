package com.example.backend.DTO.Request;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class ApartmentCreateRequest {

    private String roomNumber;

    private Integer floorNumber;

    private String direction;

    private Integer furniture;

    private Integer status;

    private BigDecimal specificPriceForBuying;

    private BigDecimal specificPriceForRenting;

    private Integer apartmentTypeId;
}