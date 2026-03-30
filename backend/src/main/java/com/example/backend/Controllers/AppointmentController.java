package com.example.backend.Controllers;

import com.example.backend.DTO.Request.appointment.*;
import com.example.backend.Entity.Appointment;
import com.example.backend.Service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public Appointment create(@Valid @RequestBody AppointmentCreateRequest request) {
        return appointmentService.create(request);
    }
    @GetMapping
    public List<Appointment> getAll() {
        return appointmentService.getAll();
    }

    @PutMapping("/{id}")
    public Appointment update(@PathVariable Integer id,
                              @RequestBody AppointmentUpdateRequest request) {
        return appointmentService.update(id, request);
    }

    @GetMapping("/{id}")
    public Appointment getById(@PathVariable Integer id) {
        return appointmentService.getById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        appointmentService.delete(id);
    }
}