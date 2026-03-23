package com.example.backend.Controllers;

import com.example.backend.DTO.Request.contract.ContractCreateRequest;
import com.example.backend.DTO.Request.contract.ContractUpdateRequest;
import com.example.backend.DTO.Request.serviceInvoce.SICreateRequest;
import com.example.backend.DTO.Request.serviceInvoce.SIUpdateRequest;
import com.example.backend.DTO.Response.ApiResponse;
import com.example.backend.Entity.Contract;
import com.example.backend.Entity.ServiceInvoice;
import com.example.backend.Service.ContractService;
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
    ApiResponse<List<ServiceInvoice>> get(){
        ApiResponse<List<ServiceInvoice>> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Lấy danh sách hóa đơn dịch vụ thành công");
        response.setResult(service.findAll());
        return response;
    }

    @GetMapping("/{id}")
    ApiResponse<ServiceInvoice> getByID(@PathVariable("id") Integer id){
        ApiResponse<ServiceInvoice> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Thông tin hóa đơn dịch vụ id: " + id);
        response.setResult(service.findById(id));
        return response;
    }

    @PostMapping
    ApiResponse<ServiceInvoice> create(@RequestBody @Valid SICreateRequest req){
        ApiResponse<ServiceInvoice> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Tạo hóa đơn dịch vụ thành công!");
        response.setResult(service.create(req));
        return response;
    }

    @PutMapping("/{id}")
    ApiResponse<ServiceInvoice> update(@PathVariable("id") Integer id, @RequestBody SIUpdateRequest req){
        ApiResponse<ServiceInvoice> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Cập nhật thông tin hóa đơn dịch vụ thành công");
        response.setResult(service.update(id, req));

        return response;
    }

    @DeleteMapping("/{id}")
    ApiResponse<ServiceInvoice> delete(@PathVariable("id") Integer id){
        ApiResponse<ServiceInvoice> response = new ApiResponse<>();

        service.delete(id);
        response.setCode(200);
        response.setMessage("Xóa hóa đơn dịch vụ thành công");

        return response;
    }

}