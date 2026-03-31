package com.example.backend.Controllers;


import com.example.backend.DTO.Request.serviceInvoce.SICreateRequest;
import com.example.backend.DTO.Request.serviceInvoce.SIUpdateRequest;
import com.example.backend.DTO.Response.ApiResponse;
import com.example.backend.Entity.ServiceInvoice;
import com.example.backend.Service.ServiceInvoiceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-invoice")
public class ServiceInvoiceController {

    @Autowired
    private ServiceInvoiceService service;

    @GetMapping
    @PreAuthorize("hasAuthority('ServiceInvoices_R_01')")
    ApiResponse<List<ServiceInvoice>> get(){
        ApiResponse<List<ServiceInvoice>> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Lấy danh sách hóa đơn dịch vụ thành công");
        response.setResult(service.findAll());
        return response;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ServiceInvoices_R_01') or @accessValidate.canViewServiceInvoice(#id, authentication)")
    ApiResponse<ServiceInvoice> getByID(@PathVariable("id") Integer id){
        ApiResponse<ServiceInvoice> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Thông tin hóa đơn dịch vụ id: " + id);
        response.setResult(service.findById(id));
        return response;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ServiceInvoices_C_01')")
    ApiResponse<ServiceInvoice> create(@RequestBody @Valid SICreateRequest req){
        ApiResponse<ServiceInvoice> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Tạo hóa đơn dịch vụ thành công!");
        response.setResult(service.create(req));
        return response;
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ServiceInvoices_U_01')")
    ApiResponse<ServiceInvoice> update(@PathVariable("id") Integer id, @RequestBody SIUpdateRequest req){
        ApiResponse<ServiceInvoice> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Cập nhật thông tin hóa đơn dịch vụ thành công");
        response.setResult(service.update(id, req));

        return response;
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ServiceInvoices_D_01')")
    ApiResponse<ServiceInvoice> delete(@PathVariable("id") Integer id){
        ApiResponse<ServiceInvoice> response = new ApiResponse<>();

        service.delete(id);
        response.setCode(200);
        response.setMessage("Xóa hóa đơn dịch vụ thành công");

        return response;
    }

}