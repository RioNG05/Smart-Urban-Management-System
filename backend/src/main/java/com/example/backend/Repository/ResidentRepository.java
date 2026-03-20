package com.example.backend.Repository;

import com.example.backend.Entity.Account;
import com.example.backend.Entity.Resident;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResidentRepository extends JpaRepository<Resident, Integer> {
    Optional<Resident> findByAccountId(Integer accountID);
}
