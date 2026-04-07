package com.example.backend.Enum;

public enum TransactionCode {
    SUCCESS(00, "TRANSACTION SUCCESS"),
    FAILED(01, "TRANSACTION FAILED"),
    WRONG_CHECKSUM(02, "WRONG CHECKSUM"),
    NOT_FOUND(03, "TRANSACTION NOT FOUND"),
    SUCCEED_ALREADY(04, "TRANSACTION ALREADY SUCCEED"),
    ;

    TransactionCode(int code, String status){
        this.code = code;
        this.status = status;
    }

    private int code;
    private String status;

    public int getCode() {
        return code;
    }

    public String getStatus() {
        return status;
    }
}
