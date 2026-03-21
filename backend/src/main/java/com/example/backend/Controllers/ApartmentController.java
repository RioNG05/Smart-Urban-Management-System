package com.example.backend.Controllers;

import com.example.backend.DTO.Request.apartment.ApartmentCreateRequest;
import com.example.backend.DTO.Request.apartment.ApartmentUpdateRequest;
import com.example.backend.DTO.Request.contract.ContractCreateRequest;
import com.example.backend.DTO.Request.contract.ContractUpdateRequest;
import com.example.backend.DTO.Response.ApiResponse;
import com.example.backend.Entity.Apartment;
import com.example.backend.Entity.Contract;
import com.example.backend.Service.ApartmentService;
import com.example.backend.Service.ContractService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apartments")
public class ApartmentController {

    @Autowired
    private ApartmentService service;

    @GetMapping
    ApiResponse<List<Apartment>> get(){
        ApiResponse<List<Apartment>> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Lấy danh sách căn hộ thành công");
        response.setResult(service.findAll());
        return response;
    }

    @GetMapping("/list/type/{id}")
    ApiResponse<List<Apartment>> getByApartmentTypeId(@PathVariable("id") Integer id){
        ApiResponse<List<Apartment>> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Thông tin căn hộ id: " + id);
        response.setResult(service.findAllByApartmentTypeId(id));
        return response;
    }

    @GetMapping("/{id}")
    ApiResponse<Apartment> getByID(@PathVariable("id") Integer id){
        ApiResponse<Apartment> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Thông tin căn hộ id: " + id);
        response.setResult(service.findById(id));
        return response;
    }

    @PostMapping
    ApiResponse<Apartment> create(@RequestBody @Valid ApartmentCreateRequest req){
        ApiResponse<Apartment> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Tạo căn hộ thành công!");
        response.setResult(service.create(req));
        return response;
    }

    @PutMapping("/{id}")
    ApiResponse<Apartment> update(@PathVariable("id") Integer id, @RequestBody ApartmentUpdateRequest req){
        ApiResponse<Apartment> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Cập nhật thông tin căn hộ thành công");
        response.setResult(service.update(id, req));

        return response;
    }

    @DeleteMapping("/{id}")
    ApiResponse<Apartment> delete(@PathVariable("id") Integer id){
        ApiResponse<Apartment> response = new ApiResponse<>();

        service.delete(id);
        response.setCode(200);
        response.setMessage("Xóa căn hộ thành công");

        return response;
    }
}