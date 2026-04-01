package com.example.backend.Controllers;

import com.example.backend.DTO.Request.stayAtHistory.SAHCreateRequest;
import com.example.backend.DTO.Request.stayAtHistory.SAHUpdateRequest;
import com.example.backend.DTO.Response.ApiResponse;
import com.example.backend.Entity.StayAtHistory;
import com.example.backend.Service.StayAtHistoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stay-at-history")
public class StayAtHistoryController {

    @Autowired
    private StayAtHistoryService service;

    @GetMapping
    ApiResponse<List<StayAtHistory>> get(){
        ApiResponse<List<StayAtHistory>> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Lấy danh sách lịch sử lưu trú thành công");
        response.setResult(service.findAll());
        return response;
    }

    @GetMapping("/{id}")
    ApiResponse<StayAtHistory> getByID(@PathVariable("id") Integer id){
        ApiResponse<StayAtHistory> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Thông tin lịch sử lưu trú id: " + id);
        response.setResult(service.findById(id));
        return response;
    }

    @GetMapping("/resident/{residentId}")
    ApiResponse<List<StayAtHistory>> getByResidentID(@PathVariable("residentId") Integer residentId){
        ApiResponse<List<StayAtHistory>> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Thông tin lịch sử lưu trú của cư dân với id: " + residentId);
        response.setResult(service.findAllByResidentId(residentId));
        return response;
    }

    @GetMapping("/apartment/{apartmentId}")
    ApiResponse<List<StayAtHistory>> getByApartmentId(@PathVariable("apartmentId") Integer apartmentId){
        ApiResponse<List<StayAtHistory>> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Thông tin lịch sử lưu trú của căn hộ id: " + apartmentId);
        response.setResult(service.findAllByApartmentId(apartmentId));
        return response;
    }

    @PostMapping
    ApiResponse<StayAtHistory> create(@RequestBody @Valid SAHCreateRequest req){
        ApiResponse<StayAtHistory> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Tạo lịch sử lưu trú thành công!");
        response.setResult(service.create(req));
        return response;
    }

    @PutMapping("/{id}")
    ApiResponse<StayAtHistory> update(@PathVariable("id") Integer id, @RequestBody SAHUpdateRequest req){
        ApiResponse<StayAtHistory> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Cập nhật thông tin lịch sử lưu trú thành công");
        response.setResult(service.update(id, req));

        return response;
    }

    @DeleteMapping("/{id}")
    ApiResponse<StayAtHistory> delete(@PathVariable("id") Integer id){
        ApiResponse<StayAtHistory> response = new ApiResponse<>();

        service.delete(id);
        response.setCode(200);
        response.setMessage("Xóa lịch sử lưu trú thành công");

        return response;
    }
}