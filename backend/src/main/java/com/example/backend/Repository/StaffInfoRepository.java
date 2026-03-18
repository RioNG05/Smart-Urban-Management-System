package com.example.backend.Repository;

import com.example.backend.Entity.StaffInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffInfoRepository extends JpaRepository<StaffInfo, Integer> {
}