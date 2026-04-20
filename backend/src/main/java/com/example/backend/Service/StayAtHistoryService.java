package com.example.backend.Service;

import com.example.backend.DTO.Request.stayAtHistory.SAHCreateRequest;
import com.example.backend.DTO.Request.stayAtHistory.SAHUpdateRequest;
import com.example.backend.Entity.*;
import com.example.backend.Repository.StayAtHistoryRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StayAtHistoryService {
    @Autowired
    StayAtHistoryRepository repository;
    @Autowired
    ResidentService residentService;
    @Autowired
    ApartmentService apartmentService;

    public List<StayAtHistory> findAll() {
        return repository.findAll();
    }

    public List<StayAtHistory> findAllByResidentId(Integer id) {
        return repository.findAllByResidentId(id);
    }

    public List<StayAtHistory> findAllByApartmentId(Integer id) {
        return repository.findAllByApartmentId(id);
    }

    public StayAtHistory findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stay history not found for id: " + id));
    }

    public StayAtHistory create(SAHCreateRequest request) {
        Apartment apartment = apartmentService.findById(request.getApartmentId());
        Resident resident = residentService.findById(request.getResidentId());

        StayAtHistory stayAtHistory = StayAtHistory.builder()
                .apartment(apartment)
                .resident(resident)
                .moveIn(request.getMoveIn())
                .moveOut(request.getMoveOut())
                .build();

        return repository.save(stayAtHistory);
    }

    public StayAtHistory update(Integer id, SAHUpdateRequest request) {
        StayAtHistory stayAtHistory = findById(id);

        if (request.getApartmentId() != null) {
            Apartment apartment = apartmentService.findById(request.getApartmentId());
            stayAtHistory.setApartment(apartment);
        }

        if (request.getResidentId() != null) {
            Resident resident = residentService.findById(request.getResidentId());
            stayAtHistory.setResident(resident);
        }

        if (request.getMoveIn() != null) {
            stayAtHistory.setMoveIn(request.getMoveIn());
        }

        if (request.getMoveOut() != null) {
            stayAtHistory.setMoveOut(request.getMoveOut());
        }

        return repository.save(stayAtHistory);
    }

    public void delete(Integer id) {
        findById(id);
        repository.deleteById(id);
    }
}

