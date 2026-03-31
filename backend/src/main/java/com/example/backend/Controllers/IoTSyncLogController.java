package com.example.backend.Controllers;

import com.example.backend.DTO.Request.iot.IoTSyncLogCreateRequest;
import com.example.backend.DTO.Request.iot.IoTSyncLogUpdateRequest;
import com.example.backend.DTO.Response.ApiResponse;
import com.example.backend.Entity.IoTSyncLog;
import com.example.backend.Service.IoTSyncLogService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/iot-logs")
public class IoTSyncLogController {

    @Autowired
    private IoTSyncLogService service;

    @GetMapping
    @PreAuthorize("hasAuthority('IoT_R_01')")
    ApiResponse<List<IoTSyncLog>> getAll(){
        ApiResponse<List<IoTSyncLog>> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Lấy danh sách log thành công");
        response.setResult(service.findAll());
        return response;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('IoT_R_01')")
    ApiResponse<IoTSyncLog> getById(@PathVariable Integer id){
        ApiResponse<IoTSyncLog> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Thông tin log id: " + id);
        response.setResult(service.findById(id));
        return response;
    }

    @GetMapping("/apartment/{apartmentId}")
    @PreAuthorize("hasAuthority('IoT_R_01')")
    ApiResponse<List<IoTSyncLog>> getByApartment(@PathVariable Integer apartmentId){
        ApiResponse<List<IoTSyncLog>> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Danh sách log theo apartment");
        response.setResult(service.findByApartmentId(apartmentId));
        return response;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('IoT_C_01')")
    ApiResponse<IoTSyncLog> create(@RequestBody @Valid IoTSyncLogCreateRequest req){
        ApiResponse<IoTSyncLog> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Tạo log thành công");
        response.setResult(service.create(req));
        return response;
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('IoT_U_01')")
    ApiResponse<IoTSyncLog> update(@PathVariable Integer id,
                                   @RequestBody IoTSyncLogUpdateRequest req){
        ApiResponse<IoTSyncLog> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Cập nhật log thành công");
        response.setResult(service.update(id, req));
        return response;
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('IoT_D_01')")
    ApiResponse<?> delete(@PathVariable Integer id){
        ApiResponse<?> response = new ApiResponse<>();

        service.delete(id);
        response.setCode(200);
        response.setMessage("Xóa log thành công");

        return response;
    }
}