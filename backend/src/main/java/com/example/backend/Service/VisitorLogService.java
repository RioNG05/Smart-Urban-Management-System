package com.example.backend.Service;

import com.example.backend.DTO.Request.visitorlog.VisitorCreateRequest;
import com.example.backend.DTO.Request.visitorlog.VisitorUpdateRequest;
import com.example.backend.Entity.Apartment;
import com.example.backend.Entity.StaffInfo;
import com.example.backend.Entity.VisitorLog;
import com.example.backend.Repository.ApartmentRepository;
import com.example.backend.Repository.StaffInfoRepository;
import com.example.backend.Repository.VisitorLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VisitorLogService {

    private final VisitorLogRepository visitorLogRepository;
    private final ApartmentRepository apartmentRepository;
    private final StaffInfoRepository staffInfoRepository;

    public VisitorLog createVisitor(VisitorCreateRequest request) {

        Apartment apartment = apartmentRepository.findById(request.getApartmentId())
                .orElseThrow(() -> new RuntimeException("Apartment not found"));

        StaffInfo staff = staffInfoRepository.findById(request.getStaffId())
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        VisitorLog visitorLog = new VisitorLog();
        visitorLog.setVisitorName(request.getVisitorName());
        visitorLog.setIdentityCard(request.getIdentityCard());
        visitorLog.setPhoneNumber(request.getPhoneNumber());
        visitorLog.setApartment(apartment);
        visitorLog.setCreatedByStaff(staff);
        visitorLog.setNote(request.getNote());
        visitorLog.setCheckInTime(LocalDateTime.now());

        return visitorLogRepository.save(visitorLog);
    }
    public List<VisitorLog> getAllVisitors() {
        return visitorLogRepository.findAll();
    }

    public VisitorLog getVisitorById(Integer id) {
        return visitorLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visitor not found"));
    }

    public VisitorLog updateVisitor(Integer id, VisitorUpdateRequest request) {

        VisitorLog visitor = visitorLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visitor not found"));
        Apartment apartment = apartmentRepository.findById(request.getApartmentId())
                .orElseThrow(() -> new RuntimeException("Apartment not found"));

        visitor.setVisitorName(request.getVisitorName());
        visitor.setIdentityCard(request.getIdentityCard());
        visitor.setPhoneNumber(request.getPhoneNumber());
        visitor.setApartment(apartment);
        visitor.setNote(request.getNote());

        return visitorLogRepository.save(visitor);
    }

    public void deleteVisitor(Integer id) {
        visitorLogRepository.deleteById(id);
    }
}
