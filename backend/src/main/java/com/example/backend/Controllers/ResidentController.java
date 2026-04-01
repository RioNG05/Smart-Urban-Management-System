package com.example.backend.Controllers;

import com.example.backend.DTO.Request.resident.ResidentCreateRequest;
import com.example.backend.DTO.Request.resident.ResidentUpdateRequest;
import com.example.backend.DTO.Response.ApiResponse;
import com.example.backend.Entity.Resident;
import com.example.backend.Service.ResidentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/residents")
public class ResidentController {

    @Autowired
    private ResidentService residentService;

    @GetMapping
    @PreAuthorize("hasAuthority('Resident_R_01')")
    ApiResponse<List<Resident>> get(){
        ApiResponse<List<Resident>> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Lấy danh sách người dân thành công!");
        response.setResult(residentService.findAll());

        return response;
    }

    @GetMapping("/{residentID}")
    @PreAuthorize("@accessValidate.canViewResidentProfile(#residentID, authentication)")
    ApiResponse<Resident> getByID(@PathVariable("residentID") Integer residentID){
        ApiResponse<Resident> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Thông tin người dân id: " + residentID);
        response.setResult(residentService.findById(residentID));
        return response;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('Resident_C_01')")
    ApiResponse<Resident> create(@RequestBody @Valid ResidentCreateRequest req){
        ApiResponse<Resident> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Tạo tài khoản người dân thành công!");
        response.setResult(residentService.create(req));
        return response;
    }

    @PutMapping("/{residentID}")
    @PreAuthorize("hasAuthority('Resident_U_01') or @accessValidate.canViewResidentProfile(#residentID, authentication)")
    ApiResponse<Resident> update(@PathVariable("residentID") Integer residentID, @RequestBody ResidentUpdateRequest req){
        ApiResponse<Resident> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Cập nhật thông tin thành công");
        response.setResult(residentService.update(residentID, req));
        
        return response;
    }

    @DeleteMapping("/{residentID}")
    @PreAuthorize("hasAuthority('Resident_D_01')")
    ApiResponse<Resident> delete(@PathVariable("residentID") Integer residentID){
        ApiResponse<Resident> response = new ApiResponse<>();

        residentService.delete(residentID);
        response.setCode(200);
        response.setMessage("Xóa tài khoản cư dân thành công");

        return response;
    }
}
