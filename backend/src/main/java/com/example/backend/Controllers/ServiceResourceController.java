package com.example.backend.Controllers;

import com.example.backend.DTO.Request.serviceResource.SRCreateRequest;
import com.example.backend.DTO.Request.serviceResource.SRUpdateRequest;
import com.example.backend.DTO.Response.ApiResponse;
import com.example.backend.Entity.ServiceResource;
import com.example.backend.Service.ServiceResourceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-resource")
public class ServiceResourceController {

    @Autowired
    private ServiceResourceService service;

    @GetMapping
    ApiResponse<List<ServiceResource>> get(){
        ApiResponse<List<ServiceResource>> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Lấy danh sách tài nguyên dịch vụ thành công!");
        response.setResult(service.findAll());

        return response;
    }

    @GetMapping("/{id}")
    ApiResponse<ServiceResource> getByID(@PathVariable("id") Integer id){
        ApiResponse<ServiceResource> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Thông tin tài nguyên dịch vụ id: " + id);
        response.setResult(service.findById(id));
        return response;
    }

    @PostMapping
    ApiResponse<ServiceResource> create(@RequestBody @Valid SRCreateRequest req){
        ApiResponse<ServiceResource> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Tạo tài nguyên dịch vụ mới thành công!");
        response.setResult(service.create(req));
        return response;
    }

    @PutMapping("/{id}")
    ApiResponse<ServiceResource> update(@PathVariable("id") Integer id, @RequestBody SRUpdateRequest req){
        ApiResponse<ServiceResource> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Cập nhật thông tin tài nguyên dịch vụ thành công");
        response.setResult(service.update(id, req));

        return response;
    }

    @DeleteMapping("/{id}")
    ApiResponse<ServiceResource> delete(@PathVariable("id") Integer id){
        ApiResponse<ServiceResource> response = new ApiResponse<>();

        service.delete(id);
        response.setCode(200);
        response.setMessage("Xóa tài nguyên dịch vụ thành công");

        return response;
    }
}
