package com.example.backend.Service;

import com.example.backend.DTO.Request.staff.StaffCreateRequest;
import com.example.backend.DTO.Request.staff.StaffUpdateRequest;
import com.example.backend.Entity.Account;
import com.example.backend.Entity.StaffInfo;
import com.example.backend.Repository.AccountRepository;
import com.example.backend.Repository.StaffInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffInfoService {

    private final StaffInfoRepository staffInfoRepository;
    private final AccountRepository accountRepository;

    public StaffInfo createStaff(StaffCreateRequest request) {

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        StaffInfo staff = new StaffInfo();
        staff.setFullName(request.getFullName());
        staff.setGender(request.getGender());
        staff.setDateOfBirth(request.getDateOfBirth());
        staff.setIdentityId(request.getIdentityId());
        staff.setAccount(account);

        return staffInfoRepository.save(staff);
    }

    public List<StaffInfo> getAllStaff() {
        return staffInfoRepository.findAll();
    }

    public StaffInfo getStaffById(Integer id) {
        return staffInfoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
    }

    public StaffInfo updateStaff(Integer id, StaffUpdateRequest request) {

        StaffInfo staff = staffInfoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        staff.setFullName(request.getFullName());
        staff.setGender(request.getGender());
        staff.setDateOfBirth(request.getDateOfBirth());
        staff.setIdentityId(request.getIdentityId());

        return staffInfoRepository.save(staff);
    }

    public void deleteStaff(Integer id) {
        staffInfoRepository.deleteById(id);
    }
}