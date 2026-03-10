package com.example.backend.Service;

import com.example.backend.DTO.Request.ResidentCreateRequest;
import com.example.backend.Entity.Account;
import com.example.backend.Entity.Apartment;
import com.example.backend.Entity.Resident;
import com.example.backend.Repository.AccountRepository;
import com.example.backend.Repository.ApartmentRepository;
import com.example.backend.Repository.ResidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
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
                .orElseThrow(() -> new RuntimeException("Apartment not found"));
    }

    public Resident create(ResidentCreateRequest request) {
        Account account = accountService.findById(request.getAccountId());

        Resident resident = Resident.builder()
                .fullName(request.getFullName())
                .gender(request.getGender())
                .dateOfBirth(request.getDateOfBirth())
                .identityId(request.getIdentityId())
                .account(account)
                .build();

        return residentRepository.save(resident);
    }

//    public Apartment update(Integer id, Apartment req) {
//        Apartment apartment = findById(id);
//
//        apartment.setRoomNumber(req.getRoomNumber());
//        apartment.setFloorNumber(req.getFloorNumber());
//        apartment.setDirection(req.getDirection());
//        apartment.setFurniture(req.getFurniture());
//        apartment.setStatus(req.getStatus());
//        apartment.setSpecificPriceForBuying(req.getSpecificPriceForBuying());
//        apartment.setSpecificPriceForRenting(req.getSpecificPriceForRenting());
//
//        return repository.save(apartment);
//    }
//
//    public void delete(Integer id) {
//        repository.deleteById(id);
//    }
}
