package com.example.backend.Repository;

import com.example.backend.Entity.Resident;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResidentRepository extends JpaRepository<Resident, Integer> {
}
