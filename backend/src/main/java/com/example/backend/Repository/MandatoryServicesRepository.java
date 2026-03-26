package com.example.backend.Repository;

import com.example.backend.Entity.MandatoryServices;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MandatoryServicesRepository extends JpaRepository<MandatoryServices, Integer> {
    Optional<MandatoryServices> findByServiceCode(String serviceCode);
}
