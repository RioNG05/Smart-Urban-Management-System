package com.example.backend.Service;

import com.example.backend.DTO.Request.iot.*;
import com.example.backend.Entity.*;
import com.example.backend.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IoTSyncLogService {

    private final IoTSyncLogRepository repository;
    private final ApartmentRepository apartmentRepository;

    public IoTSyncLog create(IoTSyncLogCreateRequest request) {

        Apartment apartment = apartmentRepository.findById(request.getApartmentId())
                .orElseThrow(() -> new RuntimeException("Apartment not found"));

        IoTSyncLog log = IoTSyncLog.builder()
                .apartment(apartment)
                .electricityEndNum(request.getElectricityEndNum())
                .waterEndNum(request.getWaterEndNum())
                .logDate(LocalDateTime.now())
                .build();

        return repository.save(log);
    }

    public IoTSyncLog update(Integer id, IoTSyncLogUpdateRequest request) {

        IoTSyncLog log = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Log not found"));

        if (request.getElectricityEndNum() != null) {
            log.setElectricityEndNum(request.getElectricityEndNum());
        }

        if (request.getWaterEndNum() != null) {
            log.setWaterEndNum(request.getWaterEndNum());
        }

        return repository.save(log);
    }

    public IoTSyncLog getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
    }

    public List<IoTSyncLog> getAll() {
        return repository.findAll();
    }

    public List<IoTSyncLog> getByApartment(Integer apartmentId) {
        return repository.findByApartmentId(apartmentId);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}