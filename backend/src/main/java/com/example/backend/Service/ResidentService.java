package com.example.backend.Service;

import com.example.backend.DTO.Request.account.AccountUpdateRequest;
import com.example.backend.DTO.Request.resident.ResidentCreateRequest;
import com.example.backend.DTO.Request.resident.ResidentUpdateRequest;
import com.example.backend.Entity.Account;
import com.example.backend.Entity.Resident;
import com.example.backend.Repository.ResidentRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResidentService {
    @Autowired
    ResidentRepository residentRepository;
    @Autowired
    AccountService accountService;

    public List<Resident> findAll() {
        return residentRepository.findAll();
    }

    public Resident findById(Integer id) {
        return residentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resident information not found for id: "+id));
    }

    public Resident create(ResidentCreateRequest request) {
        Account account = null;

        if(request.getAccountId() != null){
            accountService.changeRole(request.getAccountId(), 2);
            account = accountService.findById(request.getAccountId());
        }

        Resident resident = Resident.builder()
                .fullName(request.getFullName())
                .gender(request.getGender())
                .dateOfBirth(request.getDateOfBirth())
                .identityId(request.getIdentityId())
                .phoneNumber(request.getPhoneNumber())
                .account(account)
                .build();

        return residentRepository.save(resident);
    }

    public Resident update(Integer id, ResidentUpdateRequest req) {

        Resident resident = findById(id);

        if(req.getFullName() != null)
            resident.setFullName(req.getFullName());

        if(req.getGender() != null)
            resident.setGender(req.getGender());

        if(req.getDateOfBirth() != null)
            resident.setDateOfBirth(req.getDateOfBirth());

        if(req.getPhoneNumber() != null)
            resident.setPhoneNumber(req.getPhoneNumber());

        if(req.getIdentityId() != null){
            resident.setIdentityId(req.getIdentityId());
        }
        return residentRepository.save(resident);
    }

    public void delete(Integer id) {
        findById(id);
        residentRepository.deleteById(id);
    }

    public Resident findByAccountId(Integer accountId){
        return residentRepository.findByAccountId(accountId).orElseThrow(()->new RuntimeException("Resident account not found"));
    }
}
