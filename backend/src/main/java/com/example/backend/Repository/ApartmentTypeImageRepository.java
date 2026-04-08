package com.example.backend.Repository;

import com.example.backend.Entity.ApartmentTypeImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApartmentTypeImageRepository extends JpaRepository<ApartmentTypeImage, Integer> {
    List<ApartmentTypeImage> findAllByOrderByApartmentTypeIdAscIdAsc();
}
