package com.example.backend.Service;

import com.example.backend.DTO.Request.bookingservice.BookingServiceCreateRequest;
import com.example.backend.DTO.Request.bookingservice.BookingServiceUpdateRequest;
import com.example.backend.Entity.Account;
import com.example.backend.Entity.BookingService;
import com.example.backend.Entity.ServiceResource;
import com.example.backend.Repository.AccountRepository;
import com.example.backend.Repository.BookingServiceRepository;
import com.example.backend.Repository.ServicesResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingServiceService {

    private static final List<Integer> BLOCKING_STATUSES = List.of(0, 1);

    private final BookingServiceRepository bookingRepository;
    private final AccountRepository accountRepository;
    private final ServicesResourceRepository resourceRepository;

    public BookingServiceService(BookingServiceRepository bookingRepository,
                                 AccountRepository accountRepository,
                                 ServicesResourceRepository resourceRepository) {
        this.bookingRepository = bookingRepository;
        this.accountRepository = accountRepository;
        this.resourceRepository = resourceRepository;
    }

    public List<BookingService> findAll() {
        return bookingRepository.findAll();
    }

    public BookingService findById(Integer id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    private void validateOverlap(Integer resourceId,
                                 java.time.LocalDateTime bookFrom,
                                 java.time.LocalDateTime bookTo,
                                 Integer excludeId) {
        boolean conflict;

        if (excludeId == null) {
            conflict = bookingRepository.existsOverlappingBooking(
                    resourceId, bookFrom, bookTo, BLOCKING_STATUSES
            );
        } else {
            conflict = bookingRepository.existsOverlappingBookingExceptId(
                    resourceId, excludeId, bookFrom, bookTo, BLOCKING_STATUSES
            );
        }

        if (conflict) {
            throw new RuntimeException("Booking time overlaps with an existing booking");
        }
    }

    public BookingService create(BookingServiceCreateRequest request) {
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        ServiceResource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        validateOverlap(
                request.getResourceId(),
                request.getBookFrom(),
                request.getBookTo(),
                null
        );

        BookingService booking = new BookingService();
        booking.setAccount(account);
        booking.setServiceResource(resource);
        booking.setBookFrom(request.getBookFrom());
        booking.setBookTo(request.getBookTo());
        booking.setStatus(request.getStatus());
        booking.setTotalAmount(request.getTotalAmount());

        return bookingRepository.save(booking);
    }

    public BookingService update(Integer id, BookingServiceUpdateRequest request) {
        BookingService booking = findById(id);

        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        ServiceResource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        validateOverlap(
                request.getResourceId(),
                request.getBookFrom(),
                request.getBookTo(),
                id
        );

        booking.setAccount(account);
        booking.setServiceResource(resource);
        booking.setBookFrom(request.getBookFrom());
        booking.setBookTo(request.getBookTo());
        booking.setStatus(request.getStatus());
        booking.setTotalAmount(request.getTotalAmount());

        return bookingRepository.save(booking);
    }

    public void delete(Integer id) {
        bookingRepository.deleteById(id);
    }

    public List<BookingService> findByAccount(Integer accountId) {
        return bookingRepository.findByAccountId(accountId);
    }
}