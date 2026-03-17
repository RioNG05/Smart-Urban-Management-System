package com.example.backend.Repository;

import com.example.backend.Entity.Services;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServicesRepository extends JpaRepository<Services, Integer> {
    Optional<Services> findByServiceCode(String serviceCode);

    List<Services> findByServiceCodeIn(List<String> code);
}
