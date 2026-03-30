package com.example.backend.Service;

import com.example.backend.DTO.Request.iot.IoTSyncLogCreateRequest;
import com.example.backend.DTO.Request.iot.IoTSyncLogUpdateRequest;
import com.example.backend.Entity.Apartment;
import com.example.backend.Entity.IoTSyncLog;
import com.example.backend.Repository.IoTSyncLogRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class IoTSyncLogService {

    @Autowired
    IoTSyncLogRepository repository;

    @Autowired
    ApartmentService apartmentService;

    public List<IoTSyncLog> findAll() {
        return repository.findAll();
    }

    public IoTSyncLog findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy log id: " + id));
    }

    public List<IoTSyncLog> findByApartmentId(Integer apartmentId) {
        return repository.findAllByApartmentIdOrderByLogDateDesc(apartmentId);
    }

    public IoTSyncLog create(IoTSyncLogCreateRequest request) {

        Apartment apartment = apartmentService.findById(request.getApartmentId());

        IoTSyncLog log = IoTSyncLog.builder()
                .apartment(apartment)
                .electricityEndNum(request.getElectricityEndNum())
                .waterEndNum(request.getWaterEndNum())
                .logDate(request.getLogDate())
                .build();

        return repository.save(log);
    }

    public IoTSyncLog update(Integer id, IoTSyncLogUpdateRequest request) {

        IoTSyncLog log = findById(id);

        if(request.getApartmentId() != null){
            Apartment apartment = apartmentService.findById(request.getApartmentId());
            log.setApartment(apartment);
        }

        if(request.getElectricityEndNum() != null){
            log.setElectricityEndNum(request.getElectricityEndNum());
        }

        if(request.getWaterEndNum() != null){
            log.setWaterEndNum(request.getWaterEndNum());
        }

        return repository.save(log);
    }

    public void delete(Integer id) {
        findById(id);
        repository.deleteById(id);
    }
}