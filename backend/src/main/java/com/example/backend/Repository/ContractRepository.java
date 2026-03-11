package com.example.backend.Repository;

import com.example.backend.Entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContractRepository extends JpaRepository<Contract, Integer> {
}
