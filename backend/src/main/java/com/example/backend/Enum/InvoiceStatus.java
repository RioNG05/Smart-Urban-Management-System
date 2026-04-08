package com.example.backend.Enum;

public enum InvoiceStatus {
    UNPAID(0, "INVOICE HAVEN'T PAID YET"),
    PAID(1, "INVOICE WAS PAID")
    ;
    InvoiceStatus(Integer code, String status){
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
