package com.example.backend.Controllers;

import com.example.backend.DTO.Request.complaint.ComplaintCreateRequest;
import com.example.backend.Entity.Complaint;
import com.example.backend.Service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService service;

    public ComplaintController(ComplaintService service) {
        this.service = service;
    }

    @GetMapping
    public List<Complaint> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Complaint getById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PostMapping
    public Complaint create(@Valid @RequestBody ComplaintCreateRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public Complaint update(@PathVariable Integer id,
                            @Valid @RequestBody ComplaintCreateRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}