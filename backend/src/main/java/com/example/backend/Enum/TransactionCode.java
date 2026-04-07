package com.example.backend.Enum;

import org.hibernate.mapping.Map;

public enum TransactionCode {
    SUCCESS(0, "TRANSACTION SUCCESS"),
    FAILED(1, "TRANSACTION FAILED"),
    WRONG_CHECKSUM(2, "WRONG CHECKSUM"),
    NOT_FOUND(3, "TRANSACTION NOT FOUND"),
    SUCCEED_ALREADY(4, "TRANSACTION ALREADY SUCCEED"),
    ;

    TransactionCode(Integer code, String status){
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

    public static String getStatusByCode(Integer code) {
        for (TransactionCode t : TransactionCode.values()) {
            if (t.getCode().equals(code)) {
                return t.getStatus();
            }
        }
        return null;
    }
}
