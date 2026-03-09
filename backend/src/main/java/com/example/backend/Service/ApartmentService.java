package com.example.backend.Service;

import com.example.backend.Entity.Apartment;
import com.example.backend.Repository.ApartmentRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ApartmentService {

    private final ApartmentRepository repository;

    public ApartmentService(ApartmentRepository repository) {
        this.repository = repository;
    }

    public List<Apartment> findAll() {
        return repository.findAll();
    }

    public Apartment findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Apartment not found"));
    }

    public Apartment create(Apartment apartment) {
        return repository.save(apartment);
    }

    public Apartment update(Integer id, Apartment req) {
        Apartment apartment = findById(id);

        apartment.setRoomNumber(req.getRoomNumber());
        apartment.setFloorNumber(req.getFloorNumber());
        apartment.setDirection(req.getDirection());
        apartment.setFurniture(req.getFurniture());
        apartment.setStatus(req.getStatus());
        apartment.setSpecificPriceForBuying(req.getSpecificPriceForBuying());
        apartment.setSpecificPriceForRenting(req.getSpecificPriceForRenting());

        return repository.save(apartment);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}