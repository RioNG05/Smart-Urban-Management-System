package com.example.backend.Controllers;

import com.example.backend.DTO.Request.notification.*;
import com.example.backend.Entity.Notification;
import com.example.backend.Service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    @PostMapping
    public Notification create(@RequestBody NotificationCreateRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<Notification> getAll() {
        return service.getAll();
    }

    @GetMapping("/user/{userId}")
    public List<Notification> getByUser(@PathVariable Integer userId) {
        return service.getByUser(userId);
    }

    @GetMapping("/role/{role}")
    public List<Notification> getByRole(@PathVariable String role) {
        return service.getByRole(role);
    }

    @PutMapping("/{id}/read")
    public Notification markAsRead(@PathVariable Integer id) {
        return service.markAsRead(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
    @GetMapping("/user/{userId}/unread")
    public List<Notification> getUnread(@PathVariable Integer userId) {
        return service.getUnread(userId);
    }
    @GetMapping("/user/{userId}/unread/count")
    public long countUnread(@PathVariable Integer userId) {
        return service.countUnread(userId);
    }
    @PutMapping("/user/{userId}/read-all")
    public void markAllAsRead(@PathVariable Integer userId) {
        service.markAllAsRead(userId);
    }
}