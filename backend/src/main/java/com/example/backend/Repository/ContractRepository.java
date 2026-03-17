package com.example.backend.Repository;

import com.example.backend.Entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContractRepository extends JpaRepository<Contract, Integer> {
    Optional<Contract> findFirstByApartmentIdAndStatus(Integer apartmentId, Integer status);
    Optional<Contract> findByApartmentId(Integer apartmentId);
}
