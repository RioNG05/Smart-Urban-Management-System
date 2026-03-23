package com.example.backend.Controllers;

import com.example.backend.DTO.Request.account.AccountCreateRequest;
import com.example.backend.DTO.Request.account.AccountUpdateRequest;
import com.example.backend.DTO.Response.ApiResponse;
import com.example.backend.Entity.Account;
import com.example.backend.Entity.Role;
import com.example.backend.Repository.RoleRepository;
import com.example.backend.Service.AccountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;
    @Autowired
    private RoleRepository roleRepository;

    @GetMapping
    ApiResponse<List<Account>> get(){
        ApiResponse<List<Account>> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Lấy danh sách tài khoản thành công");
        response.setResult(accountService.findAll());
        return response;
    }

    @GetMapping("/{accountID}")
    ApiResponse<Account> getByID(@PathVariable("accountID") Integer accountID){
        ApiResponse<Account> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Thông tin tài khoản id: " + accountID);
        response.setResult(accountService.findById(accountID));
        return response;
    }

    @PostMapping
    ApiResponse<Account> create(@RequestBody @Valid AccountCreateRequest req){
        ApiResponse<Account> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Tạo tài khoản thành công!");
        response.setResult(accountService.create(req));
        return response;
    }

    @PutMapping("/change/role/{id}")
    ApiResponse<Account> changeRole(@PathVariable("id") Integer accountId, @RequestBody @Valid AccountUpdateRequest request){
        ApiResponse<Account> response = new ApiResponse<>();

        accountService.changeRole(accountId, request.getRoleId());
        response.setCode(200);
        response.setMessage("Thay vai trò thành công!");
        response.setResult(accountService.findById(accountId));
        return response;
    }


    @PutMapping("/{accountID}")
    ApiResponse<Account> update(@PathVariable("accountID") Integer accountID, @RequestBody AccountUpdateRequest req){
        ApiResponse<Account> response = new ApiResponse<>();

        response.setCode(200);
        response.setMessage("Cập nhật thông tin thành công");
        response.setResult(accountService.update(accountID,req));
        
        return response;
    }

    @DeleteMapping("/{accountID}")
    ApiResponse<Account> delete(@PathVariable("accountID") Integer accountID){
        ApiResponse<Account> response = new ApiResponse<>();

        accountService.delete(accountID);
        response.setCode(200);
        response.setMessage("Xóa tài khoản người dùng thành công");

        return response;
    }
}
