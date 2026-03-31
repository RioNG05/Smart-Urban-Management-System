package com.example.backend.Repository;

import com.example.backend.Entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContractRepository extends JpaRepository<Contract, Integer> {
    Optional<Contract> findFirstByApartmentIdAndStatus(Integer apartmentId, Integer status);
    List<Contract> findAllByApartmentId(Integer apartmentId);
    List<Contract> findAllByApartmentIdOrderByIdDesc(Integer apartmentId);
    List<Contract> findAllByAccountId(Integer accountId);
}
