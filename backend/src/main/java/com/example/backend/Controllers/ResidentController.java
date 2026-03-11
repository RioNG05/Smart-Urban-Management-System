package com.example.backend.Controllers;

import com.example.backend.DTO.Request.AccountCreateRequest;
import com.example.backend.DTO.Request.AccountUpdateRequest;
import com.example.backend.DTO.Request.ResidentCreateRequest;
import com.example.backend.DTO.Request.ResidentUpdateRequest;
import com.example.backend.DTO.Response.ApiResponse;
import com.example.backend.Entity.Account;
import com.example.backend.Entity.Resident;
import com.example.backend.Service.AccountService;
import com.example.backend.Service.ResidentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/residents")
public class ResidentController {

    @Autowired
    private ResidentService residentService;

    @GetMapping
    List<Resident> get(){
        return residentService.findAll();
    }

    @GetMapping("/{residentID}")
    Resident getByID(@PathVariable("residentID") Integer residentID){
        return residentService.findById(residentID);
    }

    @PostMapping
    ApiResponse<Resident> create(@RequestBody @Valid ResidentCreateRequest req){
        ApiResponse<Resident> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Tạo tài khoản người dân thành công!");
        response.setResult(residentService.create(req));
        return response;
    }

    @PutMapping("/{residentID}")
    ApiResponse<Resident> update(@PathVariable("residentID") Integer residentID, @RequestBody ResidentUpdateRequest req){
        ApiResponse<Resident> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Cập nhật thông tin thành công");
        response.setResult(residentService.update(residentID, req));
        
        return response;
    }

    @DeleteMapping("/{residentID}")
    ApiResponse<Resident> delete(@PathVariable("residentID") Integer residentID){
        ApiResponse<Resident> response = new ApiResponse<>();

        residentService.delete(residentID);
        response.setCode(200);
        response.setMessage("Xóa tài khoản cư dân thành công");

        return response;
    }
}
