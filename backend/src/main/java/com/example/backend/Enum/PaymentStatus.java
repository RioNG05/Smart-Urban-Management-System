package com.example.backend.Enum;

public enum PaymentStatus {
    PENDING(0, "Transaction is pending"),
    SUCCESS(1,"TRANSACTION IS SUCCESSFULLY"),
    FAILED(2, "TRANSACTION IS FAILED")
    ;

    PaymentStatus(Integer code, String status){
        this.code = code;
        this.status = status;
    }

    private Integer code;
    private String status;

    public Integer getCode() {
        return code;
    }

    public String getStatus() {
        return status;
    }
}
