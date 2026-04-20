package com.example.backend.Service;

import com.example.backend.DTO.Request.service.ServicesCreateRequest;
import com.example.backend.DTO.Request.service.ServicesUpdateRequest;
import com.example.backend.Entity.Services;
import com.example.backend.Repository.ServicesRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServicesService {
    @Autowired
    ServicesRepository repository;

    public List<Services> findAll() {
        return repository.findAll();
    }

    public Services findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found for id: " + id));
    }

    public Services create(ServicesCreateRequest request) {
        Services services = Services.builder()
                .serviceCode(request.getServiceCode())
                .serviceName(request.getServiceName())
                .feePerUnit(request.getFeePerUnit())
                .unitType(request.getUnitType())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .isBookable(Optional.of(request.isBookable()).orElse(false))
                .build();

        return repository.save(services);
    }

    public Services update(Integer id, ServicesUpdateRequest req) {

        Services services = findById(id);

        if(req.getServiceCode() != null) {
            services.setServiceCode(req.getServiceCode());
        }

        if(req.getServiceName() != null) {
            services.setServiceName(req.getServiceName());
        }

        if(req.getFeePerUnit() != null) {
            services.setFeePerUnit(req.getFeePerUnit());
        }

        if(req.getUnitType() != null) {
            services.setUnitType(req.getUnitType());
        }

        if(req.getImageUrl() != null){
            services.setImageUrl(req.getImageUrl());
        }

        if(req.getDescription() != null){
            services.setDescription(req.getDescription());
        }
        services.setBookable(req.getIsBookable());

        return repository.save(services);
    }

    public void delete(Integer id) {
        findById(id);
        repository.deleteById(id);
    }

    public Services findByServiceCode(String serviceCode){
        return repository.findByServiceCode(serviceCode).orElseThrow(() -> new RuntimeException("Không thấy dịch vụ với mã: " + serviceCode));
    }
}
