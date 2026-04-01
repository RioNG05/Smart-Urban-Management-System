package com.example.backend.Repository;

import com.example.backend.Entity.Apartment;
import com.example.backend.Entity.ApartmentType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApartmentRepository extends JpaRepository<Apartment, Integer> {
        List<Apartment> findAllByApartmentTypeId(Integer id);
        Optional<Apartment> findByRoomNumberAndFloorNumber(Integer roomNumber, Integer floorNumber);
}
