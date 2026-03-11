package com.example.backend.Controllers;

import com.example.backend.DTO.Request.ContractCreateRequest;
import com.example.backend.DTO.Request.ContractUpdateRequest;
import com.example.backend.DTO.Request.ResidentCreateRequest;
import com.example.backend.DTO.Request.ResidentUpdateRequest;
import com.example.backend.DTO.Response.ApiResponse;
import com.example.backend.Entity.Contract;
import com.example.backend.Entity.Resident;
import com.example.backend.Service.ContractService;
import com.example.backend.Service.ResidentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {

    @Autowired
    private ContractService service;

    @GetMapping
    List<Contract> get(){
        return service.findAll();
    }

    @GetMapping("/{id}")
    Contract getByID(@PathVariable("id") Integer id){
        return service.findById(id);
    }

    @PostMapping
    ApiResponse<Contract> create(@RequestBody @Valid ContractCreateRequest req){
        ApiResponse<Contract> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Tạo hợp đồng thành công!");
        response.setResult(service.create(req));
        return response;
    }

    @PutMapping("/{id}")
    ApiResponse<Contract> update(@PathVariable("id") Integer id, @RequestBody ContractUpdateRequest req){
        ApiResponse<Contract> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Cập nhật thông tin hợp đồng thành công");
        response.setResult(service.update(id, req));
        
        return response;
    }

    @DeleteMapping("/{id}")
    ApiResponse<Contract> delete(@PathVariable("id") Integer id){
        ApiResponse<Contract> response = new ApiResponse<>();

        service.delete(id);
        response.setCode(200);
        response.setMessage("Xóa hợp đồng thành công");

        return response;
    }
}
