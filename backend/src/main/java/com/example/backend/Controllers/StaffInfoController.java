package com.example.backend.Controllers;

import com.example.backend.DTO.Request.staff.StaffCreateRequest;
import com.example.backend.DTO.Request.staff.StaffUpdateRequest;
import com.example.backend.Entity.StaffInfo;
import com.example.backend.Service.StaffInfoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffInfoController {

    private final StaffInfoService staffInfoService;

    @PostMapping
    public StaffInfo createStaff(@Valid @RequestBody StaffCreateRequest request) {
        return staffInfoService.createStaff(request);
    }

    @GetMapping
    public List<StaffInfo> getAllStaff() {
        return staffInfoService.getAllStaff();
    }

    @GetMapping("/{id}")
    public StaffInfo getStaffById(@PathVariable Integer id) {
        return staffInfoService.getStaffById(id);
    }

    @PutMapping("/{id}")
    public StaffInfo updateStaff(
            @PathVariable Integer id,
            @Valid @RequestBody StaffUpdateRequest request) {
        return staffInfoService.updateStaff(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteStaff(@PathVariable Integer id) {
        staffInfoService.deleteStaff(id);
    }
}