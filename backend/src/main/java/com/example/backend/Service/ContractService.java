package com.example.backend.Service;

import com.example.backend.DTO.Request.contract.ContractCreateRequest;
import com.example.backend.DTO.Request.contract.ContractUpdateRequest;
import com.example.backend.Entity.Account;
import com.example.backend.Entity.Apartment;
import com.example.backend.Entity.Contract;
import com.example.backend.Repository.ContractRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ContractService {
    @Autowired
    ContractRepository repository;
    @Autowired
    AccountService accountService;
    @Autowired
    ApartmentService apartmentService;

    public List<Contract> findAll() {
        return repository.findAll();
    }

    public List<Contract> findAllByAccountId(Integer accountId){
        return repository.findAllByAccountId(accountId);
    }
    public List<Contract> findAllByApartmentId(Integer apartmentId){
        return repository.findAllByApartmentId(apartmentId);
    }

    public Contract findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found for id: " + id));
    }

    public Contract create(ContractCreateRequest request) {
        // --- Conditional Validation ---
        if ("Rent".equalsIgnoreCase(request.getContractType())) {
            if (request.getEndDate() == null) {
                throw new RuntimeException("Expiration date must not be blank for RENTAL contracts.");
            }
            if (request.getMonthlyRent() == null) {
                throw new RuntimeException("Monthly rent must not be blank for RENTAL contracts.");
            }
        }

        Account account = accountService.findById(request.getAccountId());
        Apartment apartment = apartmentService.findById(request.getApartmentId());

        Contract contract = Contract.builder()
                .apartment(apartment)
                .account(account)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(request.getStatus())
                .contractType(request.getContractType())
                .monthlyRent(request.getMonthlyRent())
                .createdById(request.getCreatedById())
                .build();

        return repository.save(contract);
    }

    public Contract update(Integer id, ContractUpdateRequest request) {
        Contract contract = findById(id);



        if(request.getApartmentId() != null){
            Apartment apartment = apartmentService.findById(request.getApartmentId());
            contract.setApartment(apartment);
        }

        if(request.getAccountId() != null){
            Account account = accountService.findById(request.getAccountId());
            contract.setAccount(account);
        }

        if(request.getContractType() != null){
            contract.setContractType(request.getContractType());
        }

        if(request.getStartDate() != null){
            contract.setStartDate(request.getStartDate());
        }

        if(request.getMonthlyRent() != null){
            contract.setMonthlyRent(request.getMonthlyRent());
        }

        if(request.getStatus() != null){
            contract.setStatus(request.getStatus());
        }

        if(request.getEndDate() != null){
            contract.setEndDate(request.getEndDate());
        }

        if(request.getCreatedById() != null){
            contract.setCreatedById(request.getCreatedById());
        }

        return repository.save(contract);
    }

    public void delete(Integer id) {
        findById(id);
        repository.deleteById(id);
    }
}
