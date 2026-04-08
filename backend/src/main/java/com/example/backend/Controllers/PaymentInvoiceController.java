package com.example.backend.Controllers;

import com.example.backend.DTO.Request.contract.ContractCreateRequest;
import com.example.backend.DTO.Request.contract.ContractUpdateRequest;
import com.example.backend.DTO.Request.payment_invoice.PaymentInvoiceCreateRequest;
import com.example.backend.DTO.Response.ApiResponse;
import com.example.backend.Entity.Contract;
import com.example.backend.Entity.PaymentInvoice;
import com.example.backend.Service.ContractService;
import com.example.backend.Service.PaymentInvoiceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-invoice")
public class PaymentInvoiceController {

    @Autowired
    private PaymentInvoiceService service;

    @GetMapping
    @PreAuthorize("hasAuthority('Contracts_R_01')")
    ApiResponse<List<PaymentInvoice>> get(){
        ApiResponse<List<PaymentInvoice>> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Lấy danh sách hóa đơn thành công");
        response.setResult(service.findAll());
        return response;
    }

    @GetMapping("/{id}")
    @PreAuthorize("@accessValidate.canViewContract(#id, authentication)")
    ApiResponse<PaymentInvoice> getByID(@PathVariable("id") Integer id){
        ApiResponse<PaymentInvoice> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Thông tin hóa đơn id: " + id);
        response.setResult(service.findById(id));
        return response;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('Contracts_C_01')")
    ApiResponse<PaymentInvoice> create(@RequestBody @Valid PaymentInvoiceCreateRequest req){
        ApiResponse<PaymentInvoice> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Tạo hóa đơn thành công!");
        response.setResult(service.create(req));
        return response;
    }

//    @PutMapping("/{id}")
//    @PreAuthorize("hasAuthority('Contracts_U_01')")
//    ApiResponse<Contract> update(@PathVariable("id") Integer id, @RequestBody ContractUpdateRequest req){
//        ApiResponse<Contract> response = new ApiResponse<>();
//
//        response.setCode(200);
//        response.setMessage("Cập nhật thông tin hợp đồng thành công");
//        response.setResult(service.update(id, req));
//
//        return response;
//    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('Contracts_D_01')")
    ApiResponse<PaymentInvoice> delete(@PathVariable("id") Integer id){
        ApiResponse<PaymentInvoice> response = new ApiResponse<>();

        service.delete(id);
        response.setCode(200);
        response.setMessage("Xóa hóa đơn thành công");

        return response;
    }

}