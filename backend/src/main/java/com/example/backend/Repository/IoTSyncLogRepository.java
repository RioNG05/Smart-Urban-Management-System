package com.example.backend.Repository;

import com.example.backend.Entity.IoTSyncLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IoTSyncLogRepository extends JpaRepository<IoTSyncLog, Integer> {
    List<IoTSyncLog> findAllByApartmentIdOrderByLogDateDesc(Integer apartmentId);
}
