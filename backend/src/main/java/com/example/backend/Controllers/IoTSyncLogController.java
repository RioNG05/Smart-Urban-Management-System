package com.example.backend.Controllers;

import com.example.backend.DTO.Request.iot.*;
import com.example.backend.Entity.IoTSyncLog;
import com.example.backend.Service.IoTSyncLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/iotlogs")
@RequiredArgsConstructor
public class IoTSyncLogController {

    private final IoTSyncLogService service;

    @PostMapping
    public IoTSyncLog create(@RequestBody IoTSyncLogCreateRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<IoTSyncLog> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public IoTSyncLog getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @GetMapping("/apartment/{apartmentId}")
    public List<IoTSyncLog> getByApartment(@PathVariable Integer apartmentId) {
        return service.getByApartment(apartmentId);
    }

    @PutMapping("/{id}")
    public IoTSyncLog update(@PathVariable Integer id,
                             @RequestBody IoTSyncLogUpdateRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}