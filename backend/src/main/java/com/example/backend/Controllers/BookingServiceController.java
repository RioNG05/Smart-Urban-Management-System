package com.example.backend.Controllers;

import com.example.backend.DTO.Request.bookingservice.BookingServiceCreateRequest;
import com.example.backend.Entity.BookingService;
import com.example.backend.Service.BookingServiceService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingServiceController {

    private final BookingServiceService service;

    public BookingServiceController(BookingServiceService service) {
        this.service = service;
    }

    @GetMapping
    public List<BookingService> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public BookingService getById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PostMapping
    public BookingService create(@Valid @RequestBody BookingServiceCreateRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public BookingService update(@PathVariable Integer id,
                                 @Valid @RequestBody BookingServiceCreateRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    @GetMapping("/account/{accountId}")
    public List<BookingService> getByAccount(@PathVariable Integer accountId) {
        return service.findByAccount(accountId);
    }
}