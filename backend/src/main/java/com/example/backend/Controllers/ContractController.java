package com.example.backend.Controllers;

import com.example.backend.DTO.Request.contract.ContractCreateRequest;
import com.example.backend.DTO.Request.contract.ContractUpdateRequest;
import com.example.backend.DTO.Response.ApiResponse;
import com.example.backend.Entity.Contract;
import com.example.backend.Service.ContractService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {

    @Autowired
    private ContractService service;

    @GetMapping
    @PreAuthorize("hasAuthority('Contracts_R_01')")
    ApiResponse<List<Contract>> get(){
        ApiResponse<List<Contract>> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Lấy danh sách hợp đồng thành công");
        response.setResult(service.findAll());
        return response;
    }

    @GetMapping("/{id}")
    @PreAuthorize("@accessValidate.canViewContract(#id, authentication)")
    ApiResponse<Contract> getByID(@PathVariable("id") Integer id){
        ApiResponse<Contract> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Thông tin hợp đồng id: " + id);
        response.setResult(service.findById(id));
        return response;
    }

    @GetMapping("/list/account/{accountId}")
    @PreAuthorize("@accessValidate.isAllowed(#accountId, authentication)")
    ApiResponse<List<Contract>> getAllByAccountId(@PathVariable("accountId") Integer accountId){
        ApiResponse<List<Contract>> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Lấy danh sách hợp đồng thành công");
        response.setResult(service.findAllByAccountId(accountId));
        return response;
    }

    @GetMapping("/list/apartment/{apartmentId}")
    @PreAuthorize("hasAuthority('Contracts_R_01')")
    ApiResponse<List<Contract>> getAllByApartmentId(@PathVariable("apartmentId") Integer apartmentId){
        ApiResponse<List<Contract>> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Lấy danh sách hợp đồng thành công");
        response.setResult(service.findAllByApartmentId(apartmentId));
        return response;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('Contracts_C_01')")
    ApiResponse<Contract> create(@RequestBody @Valid ContractCreateRequest req){
        ApiResponse<Contract> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Tạo hợp đồng thành công!");
        response.setResult(service.create(req));
        return response;
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('Contracts_U_01')")
    ApiResponse<Contract> update(@PathVariable("id") Integer id, @RequestBody ContractUpdateRequest req){
        ApiResponse<Contract> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Cập nhật thông tin hợp đồng thành công");
        response.setResult(service.update(id, req));

        return response;
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('Contracts_D_01')")
    ApiResponse<Contract> delete(@PathVariable("id") Integer id){
        ApiResponse<Contract> response = new ApiResponse<>();

        service.delete(id);
        response.setCode(200);
        response.setMessage("Xóa hợp đồng thành công");

        return response;
    }

}