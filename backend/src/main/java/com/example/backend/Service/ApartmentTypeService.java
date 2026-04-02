package com.example.backend.Service;

import com.example.backend.DTO.Request.apartmentType.ApartmentTypeCreateRequest;
import com.example.backend.DTO.Request.apartmentType.ApartmentTypeUpdateRequest;
import com.example.backend.DTO.Request.resident.ResidentCreateRequest;
import com.example.backend.DTO.Request.resident.ResidentUpdateRequest;
import com.example.backend.Entity.Account;
import com.example.backend.Entity.ApartmentType;
import com.example.backend.Entity.FurnitureType;
import com.example.backend.Entity.Resident;
import com.example.backend.Repository.ApartmentTypeRepository;
import com.example.backend.Repository.FurnitureTypeRepository;
import com.example.backend.Repository.ResidentRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApartmentTypeService {
    @Autowired
    ApartmentTypeRepository repository;
    @Autowired
    FurnitureTypeRepository furnitureTypeRepository;

    public List<ApartmentType> findAll() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public ApartmentType findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kiểu căn hộ với id: " + id));
    }

    public ApartmentType create(ApartmentTypeCreateRequest request) {
        FurnitureType furnitureType = furnitureTypeRepository.findById(request.getFurnitureTypeId()).orElseThrow(() ->new RuntimeException("Can't found furniture type by id: " + request.getFurnitureTypeId()));

        ApartmentType apartmentType = ApartmentType.builder()
                .name(request.getName())
                .overview(request.getOverview())
                .designSqrt(request.getDesignSqrt())
                .furnitureType(furnitureType)
                .commonPriceForRent(request.getCommonPriceForRent())
                .commonPriceForBuying(request.getCommonPriceForBuying())
                .numberOfBathroom(Optional.ofNullable(request.getNumberOfBathroom()).orElse(1))
                .numberOfBedroom(Optional.ofNullable(request.getNumberOfBedroom()).orElse(1))
                .build();

        ApartmentType saved = repository.save(apartmentType);

        return repository.findById(saved.getId()).orElseThrow();
    }

    public ApartmentType update(Integer id, ApartmentTypeUpdateRequest req) {

        ApartmentType apartmentType = findById(id);

        if(req.getName() != null) {
            apartmentType.setName(req.getName());
        }

        if(req.getOverview() != null) {
            apartmentType.setOverview(req.getOverview());
        }

        if(req.getDesignSqrt() != null) {
            apartmentType.setDesignSqrt(req.getDesignSqrt());
        }

        if(req.getFurnitureTypeId() != null) {
            FurnitureType furnitureType = furnitureTypeRepository.findById(req.getFurnitureTypeId()).orElseThrow(() ->new RuntimeException("Can't found furniture type by id: " + req.getFurnitureTypeId()));
            apartmentType.setFurnitureType(furnitureType);
        }

        if(req.getCommonPriceForRent() != null) {
            apartmentType.setCommonPriceForRent(req.getCommonPriceForRent());
        }

        if(req.getCommonPriceForBuying() != null) {
            apartmentType.setCommonPriceForBuying(req.getCommonPriceForBuying());
        }

        if(req.getNumberOfBathroom() != null) {
            apartmentType.setNumberOfBathroom(req.getNumberOfBathroom());
        }

        if(req.getNumberOfBedroom() != null) {
            apartmentType.setNumberOfBedroom(req.getNumberOfBedroom());
        }

        return repository.save(apartmentType);
    }

    public void delete(Integer id) {
        findById(id);
        repository.deleteById(id);
    }
}
