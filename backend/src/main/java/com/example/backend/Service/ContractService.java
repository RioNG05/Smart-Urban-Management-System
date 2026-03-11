package com.example.backend.Service;

import com.example.backend.DTO.Request.ResidentCreateRequest;
import com.example.backend.DTO.Request.ResidentUpdateRequest;
import com.example.backend.Entity.Account;
import com.example.backend.Entity.Contract;
import com.example.backend.Entity.Resident;
import com.example.backend.Repository.ContractRepository;
import com.example.backend.Repository.ResidentRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ContractService {
    @Autowired
    ContractRepository repository;

    public List<Contract> findAll() {
        return repository.findAll();
    }

    public Contract findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hợp đồng với id: " + id));
    }

//    public Contract create(Contract request) {
//        Account account = accountService.findById(request.getAccountId());
//
//        Resident resident = Resident.builder()
//                .fullName(request.getFullName())
//                .gender(request.getGender())
//                .dateOfBirth(request.getDateOfBirth())
//                .identityId(request.getIdentityId())
//                .account(account)
//                .build();
//
//        return residentRepository.save(resident);
//    }

//    public Resident update(Integer id, ResidentUpdateRequest req) {
//        Resident resident = findById(id);
//
//        resident = Resident.builder()
//                .fullName(req.getFullName())
//                .gender(req.getGender())
//                .dateOfBirth(req.getDateOfBirth())
//                .build();
//
//        return residentRepository.save(resident);
//    }
//
//    public void delete(Integer id) {
//        findById(id);
//        residentRepository.deleteById(id);
//    }
}
