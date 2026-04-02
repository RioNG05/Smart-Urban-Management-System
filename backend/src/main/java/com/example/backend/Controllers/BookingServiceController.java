package com.example.backend.Controllers;

import com.example.backend.DTO.Request.bookingservice.BookingServiceCreateRequest;
import com.example.backend.DTO.Request.bookingservice.BookingServiceUpdateRequest;
import com.example.backend.Entity.BookingService;
import com.example.backend.Service.BookingServiceService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAuthority('BookingServices_R_01')")
    public List<BookingService> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('BookingServices_R_01') or @accessValidate.canViewBookingService(#id, authentication)")
    public BookingService getById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('BookingServices_C_01') or @accessValidate.isResident(authentication)")
    public BookingService create(@Valid @RequestBody BookingServiceCreateRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('BookingServices_U_01') or @accessValidate.canViewBookingService(#id, authentication)")
    public BookingService update(@PathVariable Integer id,
                                 @Valid @RequestBody BookingServiceUpdateRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('BookingServices_D_01') or @accessValidate.canViewBookingService(#id, authentication)")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    @GetMapping("/account/{accountId}")
    @PreAuthorize("(" +
            "@accessValidate.isAllowed(#accountId, authentication)" +
            "and @accessValidate.isResident(authentication)" +
            ")" +
            "or hasAuthority('BookingServices_R_01')")
    public List<BookingService> getByAccount(@PathVariable Integer accountId) {
        return service.findByAccount(accountId);
    }
}