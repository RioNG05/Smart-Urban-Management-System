package com.example.backend.Controllers;

import com.example.backend.DTO.Request.expense.ExpenseCreateRequest;
import com.example.backend.DTO.Request.expense.ExpenseUpdateRequest;
import com.example.backend.DTO.Response.ApiResponse;
import com.example.backend.Entity.Expense;
import com.example.backend.Service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService service;

    @GetMapping
    @PreAuthorize("hasAuthority('Expenses_R_01')")
    ApiResponse<List<Expense>> getAll(){
        ApiResponse<List<Expense>> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Lấy danh sách chi phí thành công");
        response.setResult(service.findAll());
        return response;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('Expenses_R_01')")
    ApiResponse<Expense> getById(@PathVariable Integer id){
        ApiResponse<Expense> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Thông tin expense id: " + id);
        response.setResult(service.findById(id));
        return response;
    }

    @GetMapping("/apartment/{apartmentId}")
    @PreAuthorize("hasAuthority('Expenses_R_01')")
    ApiResponse<List<Expense>> getByApartment(@PathVariable Integer apartmentId){
        ApiResponse<List<Expense>> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Danh sách chi phí theo apartment");
        response.setResult(service.findByApartmentId(apartmentId));
        return response;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('Expenses_C_01')")
    ApiResponse<Expense> create(@RequestBody @Valid ExpenseCreateRequest req){
        ApiResponse<Expense> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Tạo chi phí thành công");
        response.setResult(service.create(req));
        return response;
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('Expenses_U_01')")
    ApiResponse<Expense> update(@PathVariable Integer id,
                                @RequestBody ExpenseUpdateRequest req){
        ApiResponse<Expense> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Cập nhật chi phí thành công");
        response.setResult(service.update(id, req));
        return response;
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('Expenses_D_01')")
    ApiResponse<?> delete(@PathVariable Integer id){
        ApiResponse<?> response = new ApiResponse<>();

        service.delete(id);
        response.setCode(200);
        response.setMessage("Xóa chi phí thành công");

        return response;
    }
}