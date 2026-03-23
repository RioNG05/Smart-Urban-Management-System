package com.example.backend.config.Security;

import com.example.backend.Entity.Account;
import com.example.backend.Entity.Contract;
import com.example.backend.Entity.Resident;
import com.example.backend.Repository.ApartmentRepository;
import com.example.backend.Repository.ContractRepository;
import com.example.backend.Repository.ResidentRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("accessValidate")
public class AccessValidate {

    @Autowired
    private ContractRepository contractRepository;
    @Autowired
    private ResidentRepository residentRepository;

    /**
     * Check xem user có được truy cập vào api của contract không
     * @param id id của contract
     * @param auth authentication header
     * @return true nếu được truy cập, false nếu không được truy cập
     */
    public boolean canViewContract(Integer id, @NonNull Authentication auth){
        Account account = (Account) auth.getPrincipal();

        Contract contract = contractRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng với id: " + id));

        boolean isOwned = contract.getAccount().getId().equals(account.getId());

        boolean isAdmin = account.getAuthorities().stream().anyMatch((a) -> a.getAuthority().equals("Contracts_R_01"));

        return isAdmin | isOwned;
    }

    /**
     * Kiểm tra xem user có quyền xem profile của resident hay không
     * @param id residentId
     * @param auth authentication header
     * @return true nếu được xem, false nếu không được
     */
    public boolean canViewResidentProfile(Integer id, @NonNull Authentication auth){
        Account account = (Account) auth.getPrincipal();
        Resident resident = residentRepository.findById(id).orElseThrow(() -> new RuntimeException("Resident Id not foud!"));
        if(account.getRole().getId() == 6){
            return false;
        } else if(account.getRole().getId() == 2){
            Resident residentAccount = residentRepository.findByAccountId(account.getId()).orElse(null);
            return residentAccount!=null && residentAccount.getId().equals(resident.getId());
        }
        return true;
    }

    /**
     * Check xem account Id được gửi từ jwt token và id ở api có trùng khớp không và cấp quyền truy cập
     * @param pathId id của account tại api
     * @param auth authentication header
     * @return true nếu trùng và false nếu không trùng
     */
    public boolean isAllowed(Integer pathId, Authentication auth){
        if(auth == null || !(auth.getPrincipal() instanceof Account)){
            throw new RuntimeException("Hệ thống không tìm thấy thông tin tài khoản hoặc bạn chưa đăng nhập");
        }
        Account account = (Account) auth.getPrincipal();
        return pathId.equals(account.getId()) || account.getRole().getId() == 1;
    }
}
