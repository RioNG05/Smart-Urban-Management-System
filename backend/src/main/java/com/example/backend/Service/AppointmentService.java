package com.example.backend.Service;

import com.example.backend.DTO.Request.appointment.*;
import com.example.backend.Entity.*;
import com.example.backend.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AccountRepository accountRepository;

    public Appointment create(AppointmentCreateRequest request) {

        Account user = accountRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account assigned = accountRepository.findById(request.getAssignedTo())
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        Account creator = accountRepository.findById(request.getCreatedBy())
                .orElseThrow(() -> new RuntimeException("Creator not found"));

        Appointment appt = new Appointment();
        appt.setUser(user);
        appt.setAssignedTo(assigned);
        appt.setCreatedBy(creator);
        appt.setLocation(request.getLocation());
        appt.setTitle(request.getTitle());
        appt.setNote(request.getNote());
        appt.setMeetingDate(request.getMeetingDate());
        appt.setStartTime(request.getStartTime());
        appt.setEndTime(request.getEndTime());
        appt.setStatus("Pending");
        appt.setCreatedAt(LocalDateTime.now());

        return appointmentRepository.save(appt);
    }

    public Appointment update(Integer id, AppointmentUpdateRequest request) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (request.getLocation() != null) appt.setLocation(request.getLocation());
        if (request.getTitle() != null) appt.setTitle(request.getTitle());
        if (request.getNote() != null) appt.setNote(request.getNote());
        if (request.getMeetingDate() != null) appt.setMeetingDate(request.getMeetingDate());
        if (request.getStartTime() != null) appt.setStartTime(request.getStartTime());
        if (request.getEndTime() != null) appt.setEndTime(request.getEndTime());
        if (request.getStatus() != null) appt.setStatus(request.getStatus());

        return appointmentRepository.save(appt);
    }

    public void delete(Integer id) {
        appointmentRepository.deleteById(id);
    }

    public Appointment getById(Integer id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
    }

    public List<Appointment> getAll() {
        return appointmentRepository.findAll();
    }
}