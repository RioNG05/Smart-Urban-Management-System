package com.example.backend.Service;

import com.example.backend.DTO.Request.apartment.ApartmentCreateRequest;
import com.example.backend.DTO.Request.apartment.ApartmentUpdateRequest;
import com.example.backend.Entity.Apartment;
import com.example.backend.Entity.ApartmentType;
import com.example.backend.Repository.ApartmentRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ApartmentService {

    private final ApartmentRepository repository;
    private final ApartmentTypeService apartmentTypeService;

    public ApartmentService(ApartmentRepository repository, ApartmentTypeService apartmentTypeService) {
        this.repository = repository;
        this.apartmentTypeService = apartmentTypeService;
    }

    public List<Apartment> findAll() {
        return repository.findAll();
    }

    public Apartment findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy căn hộ với id: "  + id));
    }

    public Apartment create(ApartmentCreateRequest req) {
        ApartmentType apartmentType = apartmentTypeService.findById(req.getApartmentTypeId());

        Apartment apartment  = Apartment.builder()
                .roomNumber(Optional.ofNullable(req.getRoomNumber()).orElse(1))
                .floorNumber(req.getFloorNumber())
                .direction(req.getDirection())
                .status(req.getStatus())
                .apartmentType(apartmentType)
                .build();
        return repository.save(apartment);
    }

    public Apartment update(Integer id, ApartmentUpdateRequest req) {

        Apartment apartment = findById(id);

        if(req.getApartmentTypeId() != null){
            ApartmentType apartmentType = apartmentTypeService.findById(req.getApartmentTypeId());
            apartment.setApartmentType(apartmentType);
        }
        if(req.getDirection() != null){
            apartment.setDirection(req.getDirection());
        }
        if(req.getStatus() != null){
            apartment.setStatus(req.getStatus());
        }
        if(req.getRoomNumber() != null) {
            apartment.setRoomNumber(req.getRoomNumber());
        }
        if(req.getFloorNumber() != null){
            apartment.setFloorNumber(req.getFloorNumber());
        }
        return repository.save(apartment);
    }

    public void delete(Integer id) {
        findById(id);
        repository.deleteById(id);
    }
}