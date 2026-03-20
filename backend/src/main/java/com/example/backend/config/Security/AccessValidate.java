package com.example.backend.config.Security;

import com.example.backend.Entity.Account;
import com.example.backend.Entity.Contract;
import com.example.backend.Repository.ContractRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("accessValidate")
public class AccessValidate {

    @Autowired
    private ContractRepository contractRepository;

    public boolean canViewContract(Integer id, @NonNull Authentication auth){
        Account account = (Account) auth.getPrincipal();

        Contract contract = contractRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng với id: " + id));

        boolean isOwned = contract.getAccount().getId().equals(account.getId());

        boolean isAdmin = account.getAuthorities().stream().anyMatch((a) -> a.getAuthority().equals("Contracts_R_01"));

        return isAdmin | isOwned;
    }

    public boolean isAllowed(Integer pathId, Authentication auth){
        if(auth == null || !(auth.getPrincipal() instanceof Account)){
            throw new RuntimeException("Hệ thống không tìm thấy thông tin tài khoản hoặc bạn chưa đăng nhập");
        }
        Account account = (Account) auth.getPrincipal();
        return pathId.equals(account.getId());
    }
}
