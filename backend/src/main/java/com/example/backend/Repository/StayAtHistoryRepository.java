package com.example.backend.Repository;

import com.example.backend.Entity.StayAtHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StayAtHistoryRepository extends JpaRepository<StayAtHistory, Integer> {
    List<StayAtHistory> findAllByResidentId(Integer residentId);
    List<StayAtHistory> findAllByApartmentId(Integer apartmentId);
}
