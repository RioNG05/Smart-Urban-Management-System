package com.example.backend.Controllers;

import com.example.backend.DTO.Request.utilitiesInvoice.UICreateRequest;
import com.example.backend.DTO.Request.utilitiesInvoice.UIUpdateRequest;
import com.example.backend.DTO.Response.ApiResponse;
import com.example.backend.Entity.UtilitiesInvoice;
import com.example.backend.Service.UtilitiesInvoiceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilities-invoice")
public class UtilitiesInvoiceController {

    @Autowired
    private UtilitiesInvoiceService service;

    @GetMapping
    ApiResponse<List<UtilitiesInvoice>> get(){
        ApiResponse<List<UtilitiesInvoice>> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Lấy danh sách hóa đơn thành công");
        response.setResult(service.findAll());
        return response;
    }

    @GetMapping("/{id}")
    ApiResponse<UtilitiesInvoice> getByID(@PathVariable("id") Integer id){
        ApiResponse<UtilitiesInvoice> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Thông tin hóa đơn id: " + id);
        response.setResult(service.findById(id));
        return response;
    }

    @GetMapping("/apartment/{id}")
    ApiResponse<List<UtilitiesInvoice>> getByApartmentID(@PathVariable("id") Integer id){
        ApiResponse<List<UtilitiesInvoice>> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Danh sách hóa đơn của căn hộ id: " + id);
        response.setResult(service.findAllByApartmentId(id));
        return response;
    }

    @PostMapping
    ApiResponse<UtilitiesInvoice> create(@RequestBody @Valid UICreateRequest req){
        ApiResponse<UtilitiesInvoice> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Tạo hóa đơn thành công!");
        response.setResult(service.create(req));
        return response;
    }

    @PutMapping("/{id}")
    ApiResponse<UtilitiesInvoice> update(@PathVariable("id") Integer id, @RequestBody UIUpdateRequest req){
        ApiResponse<UtilitiesInvoice> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Cập nhật thông tin hóa đơn thành công");
        response.setResult(service.update(id, req));

        return response;
    }

    @DeleteMapping("/{id}")
    ApiResponse<UtilitiesInvoice> delete(@PathVariable("id") Integer id){
        ApiResponse<UtilitiesInvoice> response = new ApiResponse<>();

        service.delete(id);
        response.setCode(200);
        response.setMessage("Xóa hóa đơn thành công");

        return response;
    }
}