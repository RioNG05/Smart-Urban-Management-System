package com.example.backend.Controllers;

import com.example.backend.DTO.Request.apartmentType.ApartmentTypeCreateRequest;
import com.example.backend.DTO.Request.apartmentType.ApartmentTypeUpdateRequest;
import com.example.backend.DTO.Response.ApiResponse;
import com.example.backend.Entity.ApartmentType;
import com.example.backend.Service.ApartmentTypeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAuthority('ApartmentTypes_C_01')")
    ApiResponse<ApartmentType> create(@RequestBody @Valid ApartmentTypeCreateRequest req){
        ApiResponse<ApartmentType> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Tạo kiểu căn hộ mới thành công!");
        response.setResult(service.create(req));
        return response;
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ApartmentTypes_U_01')")
    ApiResponse<ApartmentType> update(@PathVariable("id") Integer id, @RequestBody ApartmentTypeUpdateRequest req){
        ApiResponse<ApartmentType> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Cập nhật thông tin kiểu căn hộ thành công");
        response.setResult(service.update(id, req));
        
        return response;
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ApartmentTypes_D_01')")
    ApiResponse<ApartmentType> delete(@PathVariable("id") Integer id){
        ApiResponse<ApartmentType> response = new ApiResponse<>();

        service.delete(id);
        response.setCode(200);
        response.setMessage("Xóa kiểu căn hộ thành công");

        return response;
    }
}
