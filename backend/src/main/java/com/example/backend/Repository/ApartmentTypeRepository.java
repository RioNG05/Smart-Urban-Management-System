package com.example.backend.Repository;

import com.example.backend.Entity.ApartmentType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApartmentTypeRepository extends JpaRepository<ApartmentType, Integer> {
    List<ApartmentType> findAllByOrderByCreatedAtDesc();
}
