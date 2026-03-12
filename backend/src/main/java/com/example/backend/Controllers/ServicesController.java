package com.example.backend.Controllers;

import com.example.backend.DTO.Request.service.ServicesCreateRequest;
import com.example.backend.DTO.Request.service.ServicesUpdateRequest;
import com.example.backend.DTO.Response.ApiResponse;
import com.example.backend.Entity.Services;
import com.example.backend.Service.ServicesService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServicesController {

    @Autowired
    private ServicesService service;

    @GetMapping
    ApiResponse<List<Services>> get(){
        ApiResponse<List<Services>> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Lấy danh sách dịch vụ thành công!");
        response.setResult(service.findAll());

        return response;
    }

    @GetMapping("/{id}")
    ApiResponse<Services> getByID(@PathVariable("id") Integer id){
        ApiResponse<Services> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Thông tin dịch vụ id: " + id);
        response.setResult(service.findById(id));
        return response;
    }

    @PostMapping
    ApiResponse<Services> create(@RequestBody @Valid ServicesCreateRequest req){
        ApiResponse<Services> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Tạo dịch vụ mới thành công!");
        response.setResult(service.create(req));
        return response;
    }

    @PutMapping("/{id}")
    ApiResponse<Services> update(@PathVariable("id") Integer id, @RequestBody ServicesUpdateRequest req){
        ApiResponse<Services> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Cập nhật thông tin dịch vụ thành công");
        response.setResult(service.update(id, req));
        
        return response;
    }

    @DeleteMapping("/{id}")
    ApiResponse<Services> delete(@PathVariable("id") Integer id){
        ApiResponse<Services> response = new ApiResponse<>();

        service.delete(id);
        response.setCode(200);
        response.setMessage("Xóa dịch vụ thành công");

        return response;
    }
}
