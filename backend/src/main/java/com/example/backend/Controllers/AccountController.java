package com.example.backend.Controllers;

import com.example.backend.DTO.Request.AccountCreateRequest;
import com.example.backend.DTO.Request.AccountUpdateRequest;
import com.example.backend.Entity.Account;
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

    @GetMapping("/")
    List<Account> get(){
        return accountService.findAll();
    }

    @GetMapping("/{accountID}")
    Account getByID(@PathVariable("accountID") Integer accountID){
        return accountService.findById(accountID);
    }

    @PostMapping
    ApiResponse<Account> create(@RequestBody @Valid AccountCreateRequest req){
        ApiResponse<Account> response = new ApiResponse<>();


        response.setCode(200);
        response.setMessage("Tạo người dùng thành công!");
        response.setResult(accountService.create(req));
        return response;
    }


    @PutMapping("/{accountID}")
    Account update(@PathVariable("accountID") Integer accountID, @RequestBody AccountUpdateRequest req){
        return accountService.update(accountID, req);
    }

    @DeleteMapping("/{accountID}")
    String delete(@PathVariable("accountID") Integer accountID){
        accountService.delete(accountID);
        return "Delete successfull!";
    }
}
