package com.example.backend.Controllers;

import com.example.backend.DTO.Request.complaint.ComplaintCreateRequest;
import com.example.backend.Entity.Complaint;
import com.example.backend.Service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAuthority('Complaints_R_01')")
    public List<Complaint> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('Complaints_R_01') or @accessValidate.canViewComplaint(#id, authentication)")
    public Complaint getById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('Complaints_C_01')")
    public Complaint create(@Valid @RequestBody ComplaintCreateRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('Complaints_U_02') or @accessValidate.canViewComplaint(#id, authentication)")
    public Complaint update(@PathVariable Integer id,
                            @Valid @RequestBody ComplaintCreateRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('Complaints_D_01') or @accessValidate.canViewComplaint(#id, authentication)")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}