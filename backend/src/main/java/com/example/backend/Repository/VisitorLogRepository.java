package com.example.backend.Repository;

import com.example.backend.Entity.VisitorLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VisitorLogRepository extends JpaRepository<VisitorLog, Integer> {
}