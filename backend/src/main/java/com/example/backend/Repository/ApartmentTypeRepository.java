package com.example.backend.Repository;

import com.example.backend.Entity.ApartmentType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApartmentTypeRepository extends JpaRepository<ApartmentType, Integer> {
}
