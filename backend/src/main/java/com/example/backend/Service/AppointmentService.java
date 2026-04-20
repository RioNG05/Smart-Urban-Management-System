package com.example.backend.Service;

import com.example.backend.DTO.Request.appointment.*;
import com.example.backend.Entity.*;
import com.example.backend.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AccountRepository accountRepository;

    // ================= CREATE =================
    public Appointment create(AppointmentCreateRequest request) {

        Account user = getAccountOrNull(request.getUserId(), "User not found");
        Account assigned = getAccountOrNull(request.getAssignedTo(), "Staff not found");
        Account creator = getAccount(request.getCreatedBy(), "Creator not found");

        validateTime(request.getStartTime(), request.getEndTime());

        // ✅ CHECK TRÙNG LỊCH
        if (assigned != null) {
            checkConflict(
                    assigned.getId(),
                    request.getMeetingDate(),
                    request.getStartTime(),
                    request.getEndTime(),
                    null
            );
        }

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

    // ================= UPDATE =================
    public Appointment update(Integer id, AppointmentUpdateRequest request) {

        Appointment appt = getById(id);

        // merge data trước
        Account user = request.getUserId() != null
                ? getAccount(request.getUserId(), "User not found")
                : appt.getUser();

        Account assigned = request.getAssignedTo() != null
                ? getAccount(request.getAssignedTo(), "Staff not found")
                : appt.getAssignedTo();

        var date = request.getMeetingDate() != null
                ? request.getMeetingDate()
                : appt.getMeetingDate();

        var start = request.getStartTime() != null
                ? request.getStartTime()
                : appt.getStartTime();

        var end = request.getEndTime() != null
                ? request.getEndTime()
                : appt.getEndTime();

        validateTime(start, end);

        // ✅ CHECK TRÙNG LỊCH (FIX FULL BUG)
        if (assigned != null) {
            checkConflict(
                    assigned.getId(),
                    date,
                    start,
                    end,
                    appt.getId()
            );
        }

        // set data
        appt.setUser(user);
        appt.setAssignedTo(assigned);
        appt.setMeetingDate(date);
        appt.setStartTime(start);
        appt.setEndTime(end);

        if (request.getLocation() != null) appt.setLocation(request.getLocation());
        if (request.getTitle() != null) appt.setTitle(request.getTitle());
        if (request.getNote() != null) appt.setNote(request.getNote());
        if (request.getStatus() != null) appt.setStatus(request.getStatus());

        return appointmentRepository.save(appt);
    }

    // ================= DELETE =================
    public void delete(Integer id) {
        Appointment appt = getById(id);
        appointmentRepository.delete(appt);
    }

    // ================= GET =================
    public Appointment getById(Integer id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    public List<Appointment> getAll() {
        return appointmentRepository.findAll();
    }

    // ================= PRIVATE METHODS =================

    private Account getAccount(Integer id, String message) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(message));
    }

    private Account getAccountOrNull(Integer id, String message) {
        if (id == null) return null;
        return getAccount(id, message);
    }

    private void validateTime(java.time.LocalTime start, java.time.LocalTime end) {
        if (start.isAfter(end) || start.equals(end)) {
            throw new RuntimeException("StartTime must be before EndTime");
        }
    }

    private void checkConflict(Integer staffId,
                               LocalDate date,
                               LocalTime start,
                               LocalTime end,
                               Integer excludeId) {

        int count;

        if (excludeId == null) {
            // CREATE
            count = appointmentRepository.countConflict(
                    staffId,
                    date,
                    start,
                    end
            );
        } else {
            // UPDATE
            count = appointmentRepository.countConflictExcludeId(
                    staffId,
                    excludeId,
                    date,
                    start,
                    end
            );
        }

        if (count > 0) {
            throw new RuntimeException("Staff already has an appointment during this time");
        }
    }
}