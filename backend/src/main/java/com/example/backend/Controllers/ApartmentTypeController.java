package com.example.backend.Controllers;

import com.example.backend.DTO.Request.apartmentType.ApartmentTypeCreateRequest;
import com.example.backend.DTO.Request.apartmentType.ApartmentTypeUpdateRequest;
import com.example.backend.DTO.Request.resident.ResidentCreateRequest;
import com.example.backend.DTO.Request.resident.ResidentUpdateRequest;
import com.example.backend.DTO.Response.ApiResponse;
import com.example.backend.Entity.ApartmentType;
import com.example.backend.Entity.Resident;
import com.example.backend.Service.ApartmentTypeService;
import com.example.backend.Service.ResidentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apartments/type")
public class ApartmentTypeController {

    @Autowired
    private ApartmentTypeService service;

    @GetMapping
    ApiResponse<List<ApartmentType>> get(){
        ApiResponse<List<ApartmentType>> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Lấy danh sách kiểu căn hộ thành công!");
        response.setResult(service.findAll());

        return response;
    }

    @GetMapping("/{id}")
    ApiResponse<ApartmentType> getByID(@PathVariable("id") Integer id){
        ApiResponse<ApartmentType> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Thông tin kiểu căn hộ id: " + id);
        response.setResult(service.findById(id));
        return response;
    }

    @PostMapping
    ApiResponse<ApartmentType> create(@RequestBody @Valid ApartmentTypeCreateRequest req){
        ApiResponse<ApartmentType> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Tạo kiểu căn hộ mới thành công!");
        response.setResult(service.create(req));
        return response;
    }

    @PutMapping("/{id}")
    ApiResponse<ApartmentType> update(@PathVariable("id") Integer id, @RequestBody ApartmentTypeUpdateRequest req){
        ApiResponse<ApartmentType> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Cập nhật thông tin kiểu căn hộ thành công");
        response.setResult(service.update(id, req));
        
        return response;
    }

    @DeleteMapping("/{id}")
    ApiResponse<ApartmentType> delete(@PathVariable("id") Integer id){
        ApiResponse<ApartmentType> response = new ApiResponse<>();

        service.delete(id);
        response.setCode(200);
        response.setMessage("Xóa kiểu căn hộ thành công");

        return response;
    }
}
