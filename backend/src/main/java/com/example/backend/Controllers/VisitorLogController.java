package com.example.backend.Controllers;

import com.example.backend.DTO.Request.visitorlog.VisitorCreateRequest;
import com.example.backend.DTO.Request.visitorlog.VisitorUpdateRequest;
import com.example.backend.Entity.VisitorLog;
import com.example.backend.Service.VisitorLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visitors")
@RequiredArgsConstructor
public class VisitorLogController {

    private final VisitorLogService visitorLogService;

    @PostMapping
    public VisitorLog createVisitor(@Valid @RequestBody VisitorCreateRequest request) {
        return visitorLogService.createVisitor(request);
    }

    @GetMapping
    public List<VisitorLog> getAllVisitors() {
        return visitorLogService.getAllVisitors();
    }

    @GetMapping("/{id}")
    public VisitorLog getVisitorById(@PathVariable Integer id) {
        return visitorLogService.getVisitorById(id);
    }

    @PutMapping("/{id}")
    public VisitorLog updateVisitor(
            @PathVariable Integer id,
            @Valid @RequestBody VisitorUpdateRequest request) {
        return visitorLogService.updateVisitor(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteVisitor(@PathVariable Integer id) {
        visitorLogService.deleteVisitor(id);
    }
}