package com.example.backend.Service;

import com.example.backend.DTO.Request.mandatoryService.MandatoryServicesCreateRequest;
import com.example.backend.DTO.Request.mandatoryService.MandatoryServicesUpdateRequest;
import com.example.backend.DTO.Request.service.ServicesCreateRequest;
import com.example.backend.DTO.Request.service.ServicesUpdateRequest;
import com.example.backend.Entity.MandatoryServices;
import com.example.backend.Entity.Services;
import com.example.backend.Repository.MandatoryServicesRepository;
import com.example.backend.Repository.ServicesRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MandatoryServicesService {
    @Autowired
    MandatoryServicesRepository repository;

    public List<MandatoryServices> findAll() {
        return repository.findAll();
    }

    public MandatoryServices findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found for id: " + id));
    }

    public MandatoryServices create(MandatoryServicesCreateRequest request) {
        MandatoryServices services = MandatoryServices.builder()
                .serviceCode(request.getServiceCode())
                .serviceName(request.getServiceName())
                .basePrice(request.getBasePrice())
                .unitType(request.getUnitType())
                .description(request.getDescription())
                .build();

        return repository.save(services);
    }

    public MandatoryServices update(Integer id, MandatoryServicesUpdateRequest req) {

        MandatoryServices services = findById(id);

        if(req.getServiceCode() != null) {
            services.setServiceCode(req.getServiceCode());
        }

        if(req.getServiceName() != null) {
            services.setServiceName(req.getServiceName());
        }

        if(req.getBasePrice() != null) {
            services.setBasePrice(req.getBasePrice());
        }

        if(req.getUnitType() != null) {
            services.setUnitType(req.getUnitType());
        }

        if(req.getDescription() != null){
            services.setDescription(req.getDescription());
        }

        return repository.save(services);
    }

    public void delete(Integer id) {
        findById(id);
        repository.deleteById(id);
    }

    public MandatoryServices findByServiceCode(String serviceCode){
        return repository.findByServiceCode(serviceCode).orElseThrow(() -> new RuntimeException("Không thấy dịch vụ với mã: " + serviceCode));
    }
}
