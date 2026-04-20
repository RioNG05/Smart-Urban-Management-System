package com.example.backend.Service;

import com.example.backend.DTO.Request.service.ServicesCreateRequest;
import com.example.backend.DTO.Request.service.ServicesUpdateRequest;
import com.example.backend.DTO.Request.serviceResource.SRCreateRequest;
import com.example.backend.DTO.Request.serviceResource.SRUpdateRequest;
import com.example.backend.Entity.ServiceResource;
import com.example.backend.Entity.Services;
import com.example.backend.Repository.ServicesRepository;
import com.example.backend.Repository.ServicesResourceRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ServiceResourceService {
    @Autowired
    ServicesResourceRepository repository;
    @Autowired
    ServicesService servicesService;

    public List<ServiceResource> findAll() {
        return repository.findAll();
    }

    public ServiceResource findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found for id: " + id));
    }

    public ServiceResource create( SRCreateRequest request) {
        Services services = servicesService.findById(request.getServiceId());

        ServiceResource serviceResource = ServiceResource.builder()
                .resourceCode(request.getResourceCode())
                .location(request.getLocation())
                .isAvailable(Optional.ofNullable(request.getIsAvailable()).orElse(true))
                .service(services)
                .build();

        return repository.save(serviceResource);
    }

    public ServiceResource update(Integer id, SRUpdateRequest req) {

        ServiceResource serviceResource = findById(id);

        if(req.getResourceCode() != null){
            serviceResource.setResourceCode(req.getResourceCode());
        }
        if(req.getLocation() != null){
            serviceResource.setLocation(req.getLocation());
        }
        if(req.getIsAvailable() != null){
            serviceResource.setIsAvailable(req.getIsAvailable());
        }
        if(req.getServiceId() != null){
            Services services = servicesService.findById(req.getServiceId());
            serviceResource.setService(services);
        }

        return repository.save(serviceResource);
    }

    public void delete(Integer id) {
        findById(id);
        repository.deleteById(id);
    }
}
